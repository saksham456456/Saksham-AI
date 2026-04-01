"use client";

import { useState, useRef } from "react";
import { Send, StopCircle } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";

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

  return (
    <div className="p-4 border-t border-white/5 bg-background/50 backdrop-blur-md sticky bottom-0 z-10 w-full max-w-3xl mx-auto">
      <div className="relative flex items-end gap-2 bg-white/5 rounded-2xl p-2 border border-white/10 shadow-sm focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary/50 transition-all">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={
            webGPUSupported === false
              ? "Browser not supported"
              : isModelLoading
                ? "Model is loading..."
                : "Ask BriefX anything... (Shift+Enter for newline)"
          }
          className="flex-1 max-h-[200px] min-h-[44px] bg-transparent resize-none outline-none px-3 py-3 text-sm placeholder:text-muted-foreground"
          rows={1}
          disabled={disabled}
        />
        <Button
          onClick={handleSend}
          disabled={!content.trim() || disabled}
          size="icon"
          className="h-10 w-10 rounded-xl shrink-0"
        >
          {isGenerating ? <StopCircle className="h-5 w-5" /> : <Send className="h-5 w-5" />}
        </Button>
      </div>
    </div>
  );
}
