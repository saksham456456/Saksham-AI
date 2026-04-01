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
          "h-full bg-card border-r border-border flex flex-col transition-all duration-200 relative z-20 overflow-hidden",
          isOpen ? "w-[280px]" : "w-[0px] md:w-[52px]"
        )}
      >
        {/* Header */}
        <div className="h-[56px] px-3 flex items-center justify-between shrink-0 border-b border-border">
          <div className={cn("flex items-center gap-2.5 overflow-hidden", !isOpen && "md:hidden")}>
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shrink-0 shadow-sm">
              <Image src="/logo.png" alt="BriefX" width={20} height={20} className="rounded-sm" />
            </div>
            <span className="font-semibold text-[15px] text-foreground tracking-tight">BriefX</span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground shrink-0"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <PanelLeftClose className="h-4 w-4" />
            ) : (
              <PanelLeftOpen className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* New Chat button */}
        <div className={cn("px-2 pt-3 pb-1 shrink-0", !isOpen && "flex justify-center")}>
          <Button
            onClick={createChat}
            variant="ghost"
            className={cn(
              "w-full justify-start gap-2.5 h-9 rounded-md text-sm font-medium text-primary hover:bg-accent hover:text-primary border border-primary/20 bg-primary/5",
              !isOpen && "md:w-9 md:justify-center md:px-0"
            )}
          >
            <PlusCircle className="h-4 w-4 shrink-0" />
            <span className={cn(!isOpen && "md:hidden")}>New chat</span>
          </Button>
        </div>

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto px-2 py-1 custom-scrollbar space-y-0.5">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={cn(
                "group flex items-center justify-between h-9 px-2 rounded-md cursor-pointer transition-colors text-sm",
                currentChatId === chat.id
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                !isOpen && "md:justify-center"
              )}
              onClick={() => selectChat(chat.id)}
            >
              <div className="flex items-center gap-2.5 overflow-hidden min-w-0 flex-1">
                <MessageSquare
                  className={cn(
                    "h-4 w-4 shrink-0",
                    currentChatId === chat.id ? "text-primary" : "text-muted-foreground"
                  )}
                />
                <span className={cn("truncate", !isOpen && "md:hidden")}>
                  {chat.title}
                </span>
              </div>
              {isOpen && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 h-6 w-6 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0 ml-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChat(chat.id);
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className={cn(
          "px-2 py-3 border-t border-border flex items-center shrink-0",
          isOpen ? "justify-between gap-2" : "justify-center"
        )}>
          {isOpen && (
            <div className="flex items-center gap-2.5 min-w-0 overflow-hidden">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-[11px] font-bold text-primary-foreground shrink-0">
                LU
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">Local User</p>
                <p className="text-xs text-muted-foreground truncate">Private Mode</p>
              </div>
            </div>
          )}
          <SettingsDialog />
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-10 bg-foreground/20"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
