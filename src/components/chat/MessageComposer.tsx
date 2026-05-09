"use client";

import { useState, useRef } from "react";
import { Send, Square } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MessageComposer() {
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { sendMessage, isGenerating, isModelLoading, webGPUSupported } = useAppStore();

  const handleSend = () => {
    if (content.trim() && !isGenerating) {
      sendMessage(content.trim());
      setContent("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  const disabled = isGenerating || isModelLoading || webGPUSupported === false;
  const canSend = content.trim() && !disabled;

  const placeholder =
    webGPUSupported === false
      ? "Browser not supported"
      : isModelLoading
        ? "Loading model..."
        : "Message BriefX... (Shift+Enter for new line)";

  return (
    <div className="pb-4 px-4 max-w-3xl mx-auto w-full">
      <div
        className={cn(
          "relative flex items-end gap-2 bg-card border border-border rounded-xl px-3 py-2 shadow-sm",
          "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
          "transition-all duration-150"
        )}
      >
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 max-h-[200px] min-h-[40px] bg-transparent resize-none outline-none px-1 py-2 text-sm placeholder:text-muted-foreground leading-relaxed"
          rows={1}
          disabled={disabled}
        />

        <Button
          onClick={handleSend}
          disabled={!canSend}
          size="icon"
          className={cn(
            "h-8 w-8 rounded-lg shrink-0 transition-all",
            canSend
              ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
              : "bg-muted text-muted-foreground"
          )}
        >
          {isGenerating ? (
            <Square className="h-3.5 w-3.5 fill-current" />
          ) : (
            <Send className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>
      <p className="text-center text-[11px] text-muted-foreground mt-2">
        BriefX runs locally in your browser. Conversations stay private.
      </p>
    </div>
  );
}
