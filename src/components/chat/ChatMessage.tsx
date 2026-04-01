"use client";

import { useAppStore } from "@/lib/store";
import { Message } from "@/lib/db";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check, RotateCcw, BrainCircuit, User } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: Message;
  isLast: boolean;
}

export function ChatMessage({ message, isLast }: ChatMessageProps) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);
  const { regenerateMessage, isGenerating } = useAppStore();

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = () => {
    regenerateMessage(message.id);
  };

  return (
    <div
      className={cn(
        "flex w-full px-4 py-8 group transition-colors",
        isUser ? "bg-transparent" : "bg-white/[0.02]"
      )}
    >
      <div className="flex w-full max-w-3xl mx-auto gap-4 md:gap-6">
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow-sm",
            isUser
              ? "bg-primary border-primary text-primary-foreground"
              : "bg-background border-white/10"
          )}
        >
          {isUser ? <User className="h-4 w-4" /> : <BrainCircuit className="h-4 w-4 text-purple-400" />}
        </div>
        <div className="flex-1 space-y-2 overflow-hidden px-1">
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none break-words
            prose-p:leading-relaxed prose-pre:p-0 prose-pre:bg-transparent">
            {message.content ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ inline, className, children, ...props }: { inline?: boolean, className?: string, children?: React.ReactNode }) {
                    const match = /language-(\w+)/.exec(className || "");
                    const codeText = String(children).replace(/\n$/, "");

                    return !inline ? (
                      <div className="relative my-4 overflow-hidden rounded-lg bg-[#1e1e1e] border border-white/10 shadow-lg group/code">
                        <div className="flex items-center justify-between px-4 py-2 bg-black/50 border-b border-white/5">
                          <span className="text-xs text-white/50 font-mono">
                            {match?.[1] || "text"}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-white/50 hover:text-white"
                            onClick={() => {
                              navigator.clipboard.writeText(codeText);
                            }}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="p-4 overflow-x-auto text-sm text-gray-300 font-mono">
                          {children}
                        </div>
                      </div>
                    ) : (
                      <code className="bg-white/10 px-1.5 py-0.5 rounded-md font-mono text-sm text-purple-300" {...props}>
                        {children}
                      </code>
                    );
                  },
                  a: ({ ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
                    <a className="text-primary underline hover:text-primary/80" {...props} />
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="h-2 w-2 bg-primary rounded-full animate-bounce"></div>
              </div>
            )}
          </div>

          {/* Actions */}
          {!isUser && (
            <div className="flex items-center gap-1 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={handleCopy}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
              {isLast && !isGenerating && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={handleRegenerate}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
