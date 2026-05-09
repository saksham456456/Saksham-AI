"use client";

import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Settings2, Download, Trash2, RotateCcw } from "lucide-react";

export function SettingsDialog() {
  const { settings, updateSettings, clearAllChats } = useAppStore();
  const [prompt, setPrompt] = useState(settings.systemPrompt);
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    updateSettings({ systemPrompt: prompt });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
        >
          <Settings2 className="h-4 w-4" />
          <span className="sr-only">Settings</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[480px] bg-card border-border text-foreground p-0 gap-0 overflow-hidden rounded-xl shadow-xl">
        {/* Title bar */}
        <DialogHeader className="px-6 py-4 border-b border-border bg-background/60">
          <DialogTitle className="flex items-center gap-2.5 text-base font-semibold">
            <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center">
              <Settings2 className="h-4 w-4 text-primary" />
            </div>
            Settings
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-5 space-y-6">
          {/* System Prompt */}
          <section className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                Assistant personality
              </label>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground gap-1.5"
                onClick={() => setPrompt(settings.systemPrompt)}
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </Button>
            </div>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[130px] font-mono text-xs bg-background border-border resize-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary rounded-lg"
              placeholder="You are BriefX, a local AI assistant..."
            />
            <p className="text-xs text-muted-foreground">
              Customize how BriefX behaves in every conversation.
            </p>
          </section>

          {/* Data Management */}
          <section className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Data Management
            </p>

            <div className="rounded-lg border border-border overflow-hidden">
              {/* Export row */}
              <div className="flex items-center justify-between px-4 py-3 hover:bg-accent/40 transition-colors">
                <div>
                  <p className="text-sm font-medium text-foreground">Export conversations</p>
                  <p className="text-xs text-muted-foreground">Download all chats as JSON</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 text-xs border-border hover:bg-accent"
                >
                  <Download className="h-3.5 w-3.5" />
                  Export
                </Button>
              </div>

              {/* Divider */}
              <div className="border-t border-border" />

              {/* Delete row */}
              <div className="flex items-center justify-between px-4 py-3 hover:bg-destructive/5 transition-colors">
                <div>
                  <p className="text-sm font-medium text-destructive">Clear all data</p>
                  <p className="text-xs text-muted-foreground">Permanently delete all chats</p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  className="h-8 gap-1.5 text-xs"
                  onClick={() => {
                    if (
                      confirm(
                        "Are you sure you want to delete all chats? This cannot be undone."
                      )
                    ) {
                      clearAllChats();
                    }
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Clear all
                </Button>
              </div>
            </div>
          </section>
        </div>

        {/* Footer actions */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-border bg-background/60">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpen(false)}
            className="h-8 px-4 text-sm"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            className="h-8 px-4 text-sm bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
