"use client";

import clsx from "clsx";
import { MessageSquarePlus, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { ChatThread } from "@/lib/types";

export default function Sidebar({
  chats,
  activeChatId,
  onSelect,
  onNewChat,
  onDelete,
  onRename
}: {
  chats: ChatThread[];
  activeChatId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onDelete: (id: string) => void;
  onRename: (id: string) => void;
}) {
  return (
    <aside className="h-full w-full border-r border-white/10 bg-card/50 p-3 backdrop-blur">
      <div className="mb-4 flex items-center gap-2 px-2">
        <Image src="/briefx-logo.svg" alt="BriefX" width={120} height={28} priority />
      </div>
      <button onClick={onNewChat} className="mb-3 w-full rounded-xl border bg-white/5 px-3 py-2 text-left text-sm">
        <MessageSquarePlus className="mr-2 inline h-4 w-4" /> New chat
      </button>
      <div className="scrollbar h-[calc(100%-90px)] space-y-2 overflow-y-auto pr-1">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={clsx(
              "group rounded-xl border px-3 py-2 text-sm transition",
              activeChatId === chat.id ? "border-accent/60 bg-accent/20" : "bg-white/[0.03] hover:bg-white/[0.08]"
            )}
          >
            <button className="w-full truncate text-left" onClick={() => onSelect(chat.id)}>
              {chat.title}
            </button>
            <div className="mt-2 hidden gap-2 group-hover:flex">
              <button className="rounded-md border p-1" onClick={() => onRename(chat.id)} aria-label="Rename chat">
                <Pencil className="h-3 w-3" />
              </button>
              <button className="rounded-md border p-1" onClick={() => onDelete(chat.id)} aria-label="Delete chat">
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
