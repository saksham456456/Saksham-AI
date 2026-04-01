import { AppSettings, ChatThread } from "./types";
import { DEFAULT_SYSTEM_PROMPT } from "./prompt";

const CHATS_KEY = "briefx_chats_v1";
const SETTINGS_KEY = "briefx_settings_v1";
const ACTIVE_CHAT_KEY = "briefx_active_chat_v1";

export const defaultSettings: AppSettings = {
  theme: "dark",
  memoryEnabled: true,
  systemPrompt: DEFAULT_SYSTEM_PROMPT,
  responseStyle: "Balanced"
};

export function loadChats(): ChatThread[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CHATS_KEY);
    return raw ? (JSON.parse(raw) as ChatThread[]) : [];
  } catch {
    return [];
  }
}

export function saveChats(chats: ChatThread[]) {
  localStorage.setItem(CHATS_KEY, JSON.stringify(chats));
}

export function loadSettings(): AppSettings {
  if (typeof window === "undefined") return defaultSettings;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...defaultSettings, ...(JSON.parse(raw) as Partial<AppSettings>) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings: AppSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function loadActiveChatId() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACTIVE_CHAT_KEY);
}

export function saveActiveChatId(chatId: string | null) {
  if (chatId) localStorage.setItem(ACTIVE_CHAT_KEY, chatId);
  else localStorage.removeItem(ACTIVE_CHAT_KEY);
}

export function exportThread(thread: ChatThread) {
  const blob = new Blob([JSON.stringify(thread, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `briefx-${thread.title.replace(/\s+/g, "-").toLowerCase() || "chat"}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
