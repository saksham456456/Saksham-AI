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
        "flex w-full px-2 py-4 group rounded-lg transition-colors",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "flex gap-3 max-w-[85%]",
          isUser ? "flex-row-reverse" : "flex-row"
        )}
      >
        {/* Avatar */}
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold mt-0.5",
            isUser
              ? "bg-primary border-primary text-primary-foreground"
              : "bg-card border-border text-foreground"
          )}
        >
          {isUser ? (
            <User className="h-4 w-4" />
          ) : (
            <BrainCircuit className="h-4 w-4 text-primary" />
          )}
        </div>

        {/* Bubble */}
        <div className="flex flex-col gap-1.5 min-w-0">
          <div
            className={cn(
              "px-4 py-3 rounded-2xl text-sm leading-relaxed",
              isUser
                ? "bg-primary text-primary-foreground rounded-tr-sm"
                : "bg-card border border-border text-foreground rounded-tl-sm"
            )}
          >
            {message.content ? (
              <div
                className={cn(
                  "prose prose-sm max-w-none break-words",
                  isUser
                    ? "prose-invert"
                    : "dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 prose-pre:bg-transparent"
                )}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ inline, className, children, ...props }: { inline?: boolean; className?: string; children?: React.ReactNode }) {
                      const match = /language-(\w+)/.exec(className || "");
                      const codeText = String(children).replace(/\n$/, "");

                      return !inline ? (
                        <div className="relative my-3 overflow-hidden rounded-lg border border-border bg-muted group/code">
                          <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-background/60">
                            <span className="text-xs text-muted-foreground font-mono">
                              {match?.[1] || "text"}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 text-muted-foreground hover:text-foreground"
                              onClick={() => navigator.clipboard.writeText(codeText)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="p-4 overflow-x-auto text-xs font-mono text-foreground">
                            {children}
                          </div>
                        </div>
                      ) : (
                        <code
                          className="bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono text-xs"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                    a: ({ ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
                      <a className="text-primary underline hover:text-primary/80 underline-offset-2" {...props} />
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 py-0.5">
                <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="h-2 w-2 bg-primary rounded-full animate-bounce" />
              </div>
            )}
          </div>

          {/* Actions for AI messages */}
          {!isUser && (
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </Button>
              {isLast && !isGenerating && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
                  onClick={handleRegenerate}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
