"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, RefreshCcw, Settings2, Trash2 } from "lucide-react";
import { ChatCompletionMessageParam } from "@mlc-ai/web-llm";
import MarkdownMessage from "@/components/MarkdownMessage";
import MessageComposer from "@/components/MessageComposer";
import Sidebar from "@/components/Sidebar";
import SettingsPanel from "@/components/SettingsPanel";
import { buildSystemPrompt } from "@/lib/prompt";
import { browserSupport, getModelInfo, initModel, streamReply } from "@/lib/model";
import {
  defaultSettings,
  exportThread,
  loadActiveChatId,
  loadChats,
  loadSettings,
  saveActiveChatId,
  saveChats,
  saveSettings
} from "@/lib/storage";
import { AppSettings, ChatThread, LoadStage, Message } from "@/lib/types";

const newThread = (): ChatThread => ({
  id: crypto.randomUUID(),
  title: "New chat",
  messages: [],
  createdAt: Date.now(),
  updatedAt: Date.now()
});

const ts = (time: number) => new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export default function Page() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isLoadingReply, setIsLoadingReply] = useState(false);
  const [status, setStatus] = useState<LoadStage>({ stage: "Initializing local model…", progress: 0 });
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [chats, setChats] = useState<ChatThread[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const activeChat = useMemo(() => chats.find((c) => c.id === activeChatId) ?? null, [chats, activeChatId]);

  useEffect(() => {
    const loadedSettings = loadSettings();
    const loadedChats = loadChats();
    const activeId = loadActiveChatId();
    setSettings(loadedSettings);
    setChats(loadedChats.length ? loadedChats : [newThread()]);
    setActiveChatId(activeId ?? loadedChats[0]?.id ?? null);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("light", settings.theme === "light");
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    saveChats(chats);
  }, [chats]);

  useEffect(() => {
    saveActiveChatId(activeChatId);
  }, [activeChatId]);

  useEffect(() => {
    const start = async () => {
      if (!browserSupport()) {
        setError("This browser does not support WebGPU. Use latest Chrome/Edge desktop.");
        return;
      }
      try {
        await initModel(setStatus);
        setIsReady(true);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Model failed to load.");
      }
    };
    void start();
  }, []);

  const updateActiveThread = (fn: (thread: ChatThread) => ChatThread) => {
    if (!activeChat) return;
    setChats((prev) => prev.map((t) => (t.id === activeChat.id ? fn(t) : t)).sort((a, b) => b.updatedAt - a.updatedAt));
  };

  const sendMessage = async (text: string) => {
    if (!activeChat || !isReady) return;
    setError(null);
    setIsLoadingReply(true);
    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: text, createdAt: Date.now() };
    const assistantMsg: Message = { id: crypto.randomUUID(), role: "assistant", content: "", createdAt: Date.now() };

    updateActiveThread((thread) => {
      const nextTitle = thread.messages.length === 0 ? text.slice(0, 42) : thread.title;
      return { ...thread, title: nextTitle || "New chat", updatedAt: Date.now(), messages: [...thread.messages, userMsg, assistantMsg] };
    });

    const history = [...(activeChat.messages ?? []), userMsg];
    const formatted: ChatCompletionMessageParam[] = [
      { role: "system", content: buildSystemPrompt(settings.systemPrompt, settings.responseStyle, settings.memoryEnabled) },
      ...history.map((m) => ({ role: m.role, content: m.content }))
    ];

    try {
      const response = await streamReply(formatted, (partial) => {
        updateActiveThread((thread) => ({
          ...thread,
          updatedAt: Date.now(),
          messages: thread.messages.map((m) => (m.id === assistantMsg.id ? { ...m, content: partial } : m))
        }));
      });
      if (!response.trim()) throw new Error("Empty response generated.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation error.");
    } finally {
      setIsLoadingReply(false);
    }
  };

  const regenerate = async () => {
    if (!activeChat) return;
    const msgs = activeChat.messages;
    const lastUser = [...msgs].reverse().find((m) => m.role === "user");
    if (!lastUser) return;
    updateActiveThread((t) => ({ ...t, messages: t.messages.filter((m) => m.id !== msgs[msgs.length - 1]?.id) }));
    await sendMessage(lastUser.content);
  };

  const modelMeta = getModelInfo();

  return (
    <main className="h-screen overflow-hidden p-3 md:p-5">
      <section className="relative mx-auto grid h-full max-w-7xl grid-cols-1 overflow-hidden rounded-3xl border bg-surface/60 shadow-glass backdrop-blur md:grid-cols-[270px_1fr]">
        <div className="hidden md:block">
          <Sidebar
            chats={chats}
            activeChatId={activeChatId}
            onSelect={setActiveChatId}
            onNewChat={() => {
              const t = newThread();
              setChats((prev) => [t, ...prev]);
              setActiveChatId(t.id);
            }}
            onDelete={(id) => {
              const next = chats.filter((c) => c.id !== id);
              setChats(next);
              if (activeChatId === id) setActiveChatId(next[0]?.id ?? null);
            }}
            onRename={(id) => {
              const title = prompt("Rename chat");
              if (!title) return;
              setChats((prev) => prev.map((c) => (c.id === id ? { ...c, title } : c)));
            }}
          />
        </div>

        <section className="flex h-full flex-col">
          <header className="flex items-center justify-between border-b px-3 py-2 md:px-6">
            <div className="flex items-center gap-2 text-xs text-muted">
              <button className="rounded-lg border p-1.5 md:hidden" onClick={() => setDrawerOpen((v) => !v)}>
                <Menu className="h-4 w-4" />
              </button>
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" /> {isReady ? "Ready to chat" : status.stage}
            </div>
            <div className="flex items-center gap-2">
              <button className="rounded-lg border px-2 py-1 text-xs" onClick={() => setSettingsOpen((v) => !v)}>
                <Settings2 className="mr-1 inline h-3.5 w-3.5" /> Settings
              </button>
              <button
                className="rounded-lg border px-2 py-1 text-xs"
                onClick={() => activeChat && setChats((prev) => prev.map((c) => (c.id === activeChat.id ? { ...c, messages: [] } : c)))}
              >
                <Trash2 className="mr-1 inline h-3.5 w-3.5" /> Clear
              </button>
            </div>
          </header>

          {!isReady && !error && (
            <div className="mx-4 mt-4 rounded-xl border bg-card/70 p-4">
              <p className="text-sm">{status.stage}</p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full bg-accent" style={{ width: `${Math.round(status.progress * 100)}%` }} />
              </div>
            </div>
          )}

          {error && (
            <div className="mx-4 mt-4 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200">
              <p className="font-semibold">Model error</p>
              <p className="mt-1">{error}</p>
              <button className="mt-3 rounded-lg border px-3 py-1 text-xs" onClick={() => location.reload()}>
                Retry
              </button>
            </div>
          )}

          <div className="scrollbar flex-1 space-y-4 overflow-y-auto px-3 py-4 md:px-8">
            {activeChat?.messages.length ? (
              <AnimatePresence initial={false}>
                {activeChat.messages.map((m) => (
                  <motion.article
                    key={m.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`max-w-[85%] rounded-2xl border p-3 shadow-glass ${
                      m.role === "user" ? "ml-auto bg-accent/20" : "bg-card/70"
                    }`}
                  >
                    <p className="mb-1 text-[10px] uppercase tracking-wider text-muted">{m.role === "user" ? "You" : "BriefMind"}</p>
                    {m.role === "assistant" ? <MarkdownMessage content={m.content || "…"} /> : <p className="text-sm">{m.content}</p>}
                    <p className="mt-2 text-right text-[10px] text-muted">{ts(m.createdAt)}</p>
                  </motion.article>
                ))}
              </AnimatePresence>
            ) : (
              <div className="mx-auto mt-20 max-w-xl rounded-2xl border border-dashed bg-card/30 p-8 text-center">
                <div className="mx-auto mb-4 h-12 w-12 rounded-2xl border bg-gradient-to-br from-cyan-400/30 to-violet-500/30" />
                <h2 className="text-lg font-semibold">Welcome to BriefX</h2>
                <p className="mt-2 text-sm text-muted">
                  Private by default. Your model runs entirely in this browser. No hosted chat API. Start a thread and ask anything.
                </p>
              </div>
            )}
          </div>

          <div className="border-t px-3 py-3 md:px-8">
            <MessageComposer onSend={sendMessage} disabled={!isReady || isLoadingReply} />
            <div className="mt-2 flex justify-end gap-2">
              <button className="rounded-md border px-2 py-1 text-xs" onClick={regenerate}>
                <RefreshCcw className="mr-1 inline h-3 w-3" /> Regenerate
              </button>
            </div>
          </div>
        </section>

        <AnimatePresence>
          {drawerOpen && (
            <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} className="absolute inset-y-0 left-0 z-20 w-72 md:hidden">
              <Sidebar
                chats={chats}
                activeChatId={activeChatId}
                onSelect={(id) => {
                  setActiveChatId(id);
                  setDrawerOpen(false);
                }}
                onNewChat={() => {
                  const t = newThread();
                  setChats((prev) => [t, ...prev]);
                  setActiveChatId(t.id);
                  setDrawerOpen(false);
                }}
                onDelete={(id) => setChats((prev) => prev.filter((c) => c.id !== id))}
                onRename={(id) => {
                  const title = prompt("Rename chat");
                  if (!title) return;
                  setChats((prev) => prev.map((c) => (c.id === id ? { ...c, title } : c)));
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {settingsOpen && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="absolute right-3 top-14 z-30 w-[min(96vw,360px)]"
            >
              <SettingsPanel
                settings={settings}
                modelLabel={`${modelMeta.id} • ${modelMeta.runtime}`}
                onUpdate={setSettings}
                onExport={() => activeChat && exportThread(activeChat)}
                onClearAll={() => {
                  setChats([newThread()]);
                  setSettings(defaultSettings);
                  localStorage.clear();
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}
