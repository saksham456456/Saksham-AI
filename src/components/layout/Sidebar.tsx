"use client";

import { useAppStore } from "@/lib/store";
import { SettingsDialog } from "@/components/settings/SettingsDialog";
import { Button } from "@/components/ui/button";
import { PlusCircle, MessageSquare, Trash2, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Image from "next/image";

export function Sidebar() {
  const { chats, currentChatId, createChat, selectChat, deleteChat } = useAppStore();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <div
        className={cn(
          "h-full bg-[#1e1e1e]/50 backdrop-blur-xl border-r border-white/5 flex flex-col transition-all duration-300 relative z-20 shadow-2xl overflow-hidden",
          isOpen ? "w-[280px]" : "w-[0px] md:w-[80px]"
        )}
      >
        <div className="p-4 flex items-center justify-between border-b border-white/5 bg-background/50 h-[72px] shrink-0">
          <div className={cn("flex items-center gap-3 overflow-hidden", !isOpen && "md:hidden")}>
            <Image src="/logo.png" alt="BriefX Logo" width={32} height={32} className="rounded-xl shadow-lg shadow-primary/20 bg-black" />
            <h1 className="font-bold text-xl tracking-tight bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">BriefX</h1>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
          </Button>
        </div>

        <div className={cn("p-4 flex flex-col gap-2 shrink-0", !isOpen && "items-center")}>
          <Button
            onClick={createChat}
            className={cn(
              "justify-start gap-3 w-full bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 shadow-none",
              !isOpen && "md:justify-center md:px-0"
            )}
          >
            <PlusCircle className="h-5 w-5" />
            <span className={cn("font-medium", !isOpen && "md:hidden")}>New Chat</span>
          </Button>
        </div>

        <div className={cn("flex-1 overflow-y-auto px-3 py-2 space-y-1 custom-scrollbar", !isOpen && "items-center")}>
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={cn(
                "group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border border-transparent",
                currentChatId === chat.id
                  ? "bg-white/10 text-foreground border-white/5 shadow-inner"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                !isOpen && "md:justify-center"
              )}
              onClick={() => selectChat(chat.id)}
            >
              <div className="flex items-center gap-3 overflow-hidden min-w-0 flex-1">
                <MessageSquare className="h-4 w-4 shrink-0 text-white/50" />
                <span className={cn("truncate text-sm font-medium", !isOpen && "md:hidden")}>
                  {chat.title}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "opacity-0 group-hover:opacity-100 h-7 w-7 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 shrink-0",
                  (!isOpen || currentChatId !== chat.id) && "md:hidden",
                  isOpen && "block"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChat(chat.id);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="p-4 mt-auto border-t border-white/5 bg-background/50 flex items-center justify-between shrink-0">
          <div className={cn("flex items-center gap-3", !isOpen && "md:hidden")}>
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-lg">
              Me
            </div>
            <span className="text-sm font-medium">Local User</span>
          </div>
          <div className={cn("", !isOpen && "md:w-full md:flex md:justify-center")}>
             <SettingsDialog />
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-10 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
