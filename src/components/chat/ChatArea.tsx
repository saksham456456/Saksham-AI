"use client";

import { useAppStore } from "@/lib/store";
import { Message } from "@/lib/db";
import { ChatMessage } from "./ChatMessage";
import { useEffect, useRef } from "react";
import { MessageComposer } from "./MessageComposer";
import { BrainCircuit, Sparkles } from "lucide-react";

export function ChatArea() {
  const { messages, currentChatId, isModelLoading, modelLoadProgress } = useAppStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!currentChatId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm h-full w-full">
        <div className="flex items-center gap-3 animate-pulse text-muted-foreground">
          <BrainCircuit className="h-6 w-6 text-primary" />
          <p className="font-medium text-lg">Initializing Workspace...</p>
        </div>
      </div>
    );
  }

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col flex-1 h-full w-full bg-background overflow-hidden relative">
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 w-full max-w-4xl mx-auto scroll-smooth">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="h-24 w-24 rounded-3xl bg-gradient-to-tr from-purple-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center shadow-2xl backdrop-blur-xl">
              <Sparkles className="h-10 w-10 text-primary" />
            </div>
            <div className="space-y-2 max-w-md">
              <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent">
                Welcome to BriefX
              </h2>
              <p className="text-muted-foreground text-sm">
                A highly capable, privacy-first AI assistant that runs entirely in your browser. No data leaves your device.
              </p>
            </div>
            {isModelLoading && (
              <div className="mt-8 flex flex-col items-center space-y-4 w-full max-w-sm">
                <div className="text-sm font-medium text-muted-foreground">
                  {modelLoadProgress?.text || "Warming up engines..."}
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${(modelLoadProgress?.progress || 0) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6 pb-20">
            {messages.map((message: Message, idx: number) => (
              <ChatMessage
                key={message.id}
                message={message}
                isLast={idx === messages.length - 1}
              />
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <div className="w-full absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/90 to-transparent pt-10">
        <MessageComposer />
      </div>
    </div>
  );
}
