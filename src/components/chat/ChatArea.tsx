"use client";

import { useAppStore } from "@/lib/store";
import { Message } from "@/lib/db";
import { ChatMessage } from "./ChatMessage";
import { useEffect, useRef } from "react";
import { MessageComposer } from "./MessageComposer";
import { Loader2, Sparkles } from "lucide-react";

export function ChatArea() {
  const { messages, currentChatId, isModelLoading, modelLoadProgress } = useAppStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!currentChatId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-background h-full w-full">
        <div className="flex items-center gap-2.5 text-muted-foreground">
          <Loader2 className="h-5 w-5 text-primary animate-spin" />
          <p className="text-sm font-medium">Initializing workspace...</p>
        </div>
      </div>
    );
  }

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col flex-1 h-full w-full bg-background overflow-hidden relative">
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 w-full max-w-3xl mx-auto scroll-smooth custom-scrollbar">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-5 opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Fluent-style icon container */}
            <div className="h-20 w-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-sm">
              <Sparkles className="h-9 w-9 text-primary" />
            </div>

            <div className="space-y-2 max-w-sm">
              <h2 className="text-2xl font-semibold text-foreground tracking-tight">
                Welcome to BriefX
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A privacy-first AI assistant running entirely in your browser. Your conversations never leave your device.
              </p>
            </div>

            {/* Quick action chips */}
            <div className="flex flex-wrap gap-2 justify-center pt-2">
              {[
                "Summarize a document",
                "Write a quick email",
                "Explain a concept",
                "Help me brainstorm",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  className="px-3 py-1.5 text-xs rounded-full border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-accent hover:border-primary/30 transition-colors font-medium"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            {isModelLoading && (
              <div className="mt-4 flex flex-col items-center gap-3 w-full max-w-xs">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                  {modelLoadProgress?.text || "Loading AI model..."}
                </div>
                <div className="w-full h-1 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${(modelLoadProgress?.progress || 0) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-1 pb-32">
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

      <div className="w-full absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/95 to-transparent pt-8">
        <MessageComposer />
      </div>
    </div>
  );
}
