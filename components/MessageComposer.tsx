"use client";

import { Mic, SendHorizonal } from "lucide-react";
import { FormEvent, useState } from "react";

export default function MessageComposer({
  onSend,
  disabled
}: {
  onSend: (text: string) => Promise<void>;
  disabled?: boolean;
}) {
  const [value, setValue] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const text = value.trim();
    if (!text || disabled) return;
    setValue("");
    await onSend(text);
  };

  return (
    <form onSubmit={submit} className="sticky bottom-0 rounded-2xl border bg-card/80 p-3 shadow-glass backdrop-blur">
      <label htmlFor="message" className="sr-only">
        Message
      </label>
      <textarea
        id="message"
        className="max-h-40 min-h-24 w-full resize-y rounded-xl bg-transparent p-3 text-sm outline-none placeholder:text-muted"
        placeholder="Message BriefX... (Enter to send, Shift+Enter newline)"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={async (e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            await submit(e as unknown as FormEvent);
          }
        }}
        disabled={disabled}
      />
      <div className="mt-2 flex items-center justify-between px-2">
        <button type="button" className="rounded-lg border px-3 py-1.5 text-xs text-muted" aria-label="Voice input placeholder">
          <Mic className="mr-1 inline h-3.5 w-3.5" /> Voice
        </button>
        <button
          type="submit"
          className="rounded-lg bg-accent/90 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
          disabled={disabled || !value.trim()}
          aria-label="Send message"
        >
          <SendHorizonal className="mr-1 inline h-3.5 w-3.5" /> Send
        </button>
      </div>
    </form>
  );
}
