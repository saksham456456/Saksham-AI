import { create } from 'zustand';
import { db, Chat, Message, defaultSystemPrompt, Settings } from './db';
import { webLLM } from './webllm';
import { v4 as uuidv4 } from 'uuid';
import { InitProgressReport, ChatCompletionMessageParam } from '@mlc-ai/web-llm';

interface AppState {
  chats: Chat[];
  currentChatId: string | null;
  messages: Message[];
  settings: Settings;
  isModelLoading: boolean;
  modelLoadProgress: InitProgressReport | null;
  modelLoadError: string | null;
  isGenerating: boolean;
  webGPUSupported: boolean | null;

  initApp: () => Promise<void>;
  checkWebGPU: () => void;
  loadModel: () => Promise<void>;
  createChat: () => Promise<string>;
  selectChat: (chatId: string) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  clearAllChats: () => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  regenerateMessage: (messageId: string) => Promise<void>;
  updateSettings: (newSettings: Partial<Settings>) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  chats: [],
  currentChatId: null,
  messages: [],
  settings: {
    id: 'default',
    systemPrompt: defaultSystemPrompt,
    model: 'Phi-3-mini-4k-instruct-q4f16_1-MLC',
    temperature: 0.7,
  },
  isModelLoading: false,
  modelLoadProgress: null,
  modelLoadError: null,
  isGenerating: false,
  webGPUSupported: null,

  initApp: async () => {
    get().checkWebGPU();

    // Load settings
    const savedSettings = await db.settings.get('default');
    if (!savedSettings) {
      await db.settings.put(get().settings);
    } else {
      set({ settings: savedSettings });
    }

    // Load chats
    const chats = await db.chats.orderBy('updatedAt').reverse().toArray();
    set({ chats });

    if (chats.length > 0) {
      await get().selectChat(chats[0].id);
    } else {
      await get().createChat();
    }
  },

  checkWebGPU: () => {
    const supported = 'gpu' in navigator;
    set({ webGPUSupported: supported });
  },

  loadModel: async () => {
    if (!get().webGPUSupported) {
      set({ modelLoadError: 'WebGPU is not supported in your browser.' });
      return;
    }

    set({ isModelLoading: true, modelLoadError: null, modelLoadProgress: null });

    webLLM.setProgressCallback((progress: InitProgressReport) => {
      set({ modelLoadProgress: progress });
    });

    try {
      await webLLM.loadModel(get().settings.model);
      set({ isModelLoading: false });
    } catch (error: unknown) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load model. Please try again.';
      set({
        isModelLoading: false,
        modelLoadError: errorMessage,
      });
    }
  },

  createChat: async () => {
    const newChat: Chat = {
      id: uuidv4(),
      title: 'New Chat',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await db.chats.add(newChat);
    const chats = await db.chats.orderBy('updatedAt').reverse().toArray();
    set({ chats, currentChatId: newChat.id, messages: [] });
    return newChat.id;
  },

  selectChat: async (chatId: string) => {
    const messages = await db.messages
      .where('chatId')
      .equals(chatId)
      .sortBy('createdAt');
    set({ currentChatId: chatId, messages });
  },

  deleteChat: async (chatId: string) => {
    await db.chats.delete(chatId);
    await db.messages.where('chatId').equals(chatId).delete();
    const chats = await db.chats.orderBy('updatedAt').reverse().toArray();

    set({ chats });

    if (get().currentChatId === chatId) {
      if (chats.length > 0) {
        await get().selectChat(chats[0].id);
      } else {
        await get().createChat();
      }
    }
  },

  clearAllChats: async () => {
    await db.chats.clear();
    await db.messages.clear();
    set({ chats: [], messages: [] });
    await get().createChat();
  },

  sendMessage: async (content: string) => {
    const { currentChatId, settings } = get();
    if (!currentChatId || !webLLM.isReady() || get().isGenerating) return;

    set({ isGenerating: true });

    const userMessageId = uuidv4();
    const userMessage: Message = {
      id: userMessageId,
      chatId: currentChatId,
      role: 'user',
      content,
      createdAt: Date.now(),
    };

    const assistantMessageId = uuidv4();
    const assistantMessage: Message = {
      id: assistantMessageId,
      chatId: currentChatId,
      role: 'assistant',
      content: '',
      createdAt: Date.now() + 1,
    };

    // Update UI optimisticly
    set((state) => ({
      messages: [...state.messages, userMessage, assistantMessage],
    }));

    // Update DB
    await db.messages.add(userMessage);

    // If first message, update chat title
    const currentMessages = get().messages;
    if (currentMessages.length <= 2) {
      const title = content.length > 30 ? content.substring(0, 30) + '...' : content;
      await db.chats.update(currentChatId, { title, updatedAt: Date.now() });
      const chats = await db.chats.orderBy('updatedAt').reverse().toArray();
      set({ chats });
    }

    try {
      // Prepare history for model
      const mlcMessages = [
        { role: 'system' as const, content: settings.systemPrompt },
        ...currentMessages.map(m => ({ role: m.role as 'user'|'assistant', content: m.content })),
        { role: 'user' as const, content }
      ];

      const stream = webLLM.generateResponseStream(
        mlcMessages as ChatCompletionMessageParam[],
        settings.temperature
      );
      let fullResponse = '';

      for await (const chunk of stream) {
        fullResponse += chunk;
        set((state) => ({
          messages: state.messages.map((m) =>
            m.id === assistantMessageId ? { ...m, content: fullResponse } : m
          ),
        }));
      }

      // Final save to DB
      await db.messages.add({ ...assistantMessage, content: fullResponse });
      await db.chats.update(currentChatId, { updatedAt: Date.now() });

    } catch (error) {
      console.error(error);
      set((state) => ({
        messages: state.messages.map((m) =>
          m.id === assistantMessageId ? { ...m, content: 'Error: Failed to generate response.' } : m
        ),
      }));
    } finally {
      set({ isGenerating: false });
    }
  },

  regenerateMessage: async (messageId: string) => {
    // Basic regenerate logic: find the user message before this assistant message
    const { messages, currentChatId, settings } = get();
    if (!currentChatId || !webLLM.isReady() || get().isGenerating) return;

    const msgIndex = messages.findIndex(m => m.id === messageId);
    if (msgIndex <= 0 || messages[msgIndex].role !== 'assistant') return;

    // Remove the old assistant message and anything after it
    const newHistory = messages.slice(0, msgIndex);
    const userMessage = newHistory[newHistory.length - 1];

    if (!userMessage || userMessage.role !== 'user') return;

    // Delete old messages from DB
    const msgsToDelete = messages.slice(msgIndex).map(m => m.id);
    await db.messages.bulkDelete(msgsToDelete);

    set({ messages: newHistory, isGenerating: true });

    const assistantMessageId = uuidv4();
    const assistantMessage: Message = {
      id: assistantMessageId,
      chatId: currentChatId,
      role: 'assistant',
      content: '',
      createdAt: Date.now(),
    };

    set((state) => ({
      messages: [...state.messages, assistantMessage],
    }));

    try {
      const mlcMessages = [
        { role: 'system' as const, content: settings.systemPrompt },
        ...newHistory.map(m => ({ role: m.role as 'user'|'assistant', content: m.content })),
      ];

      const stream = webLLM.generateResponseStream(
        mlcMessages as ChatCompletionMessageParam[],
        settings.temperature
      );
      let fullResponse = '';

      for await (const chunk of stream) {
        fullResponse += chunk;
        set((state) => ({
          messages: state.messages.map((m) =>
            m.id === assistantMessageId ? { ...m, content: fullResponse } : m
          ),
        }));
      }

      await db.messages.add({ ...assistantMessage, content: fullResponse });
      await db.chats.update(currentChatId, { updatedAt: Date.now() });

    } catch (error) {
      console.error(error);
    } finally {
      set({ isGenerating: false });
    }
  },

  updateSettings: async (newSettings: Partial<Settings>) => {
    const updated = { ...get().settings, ...newSettings };
    set({ settings: updated });
    await db.settings.put(updated);
  },
}));
