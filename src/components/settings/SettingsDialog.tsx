"use client";

import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Settings2, Download, Trash2, SlidersHorizontal } from "lucide-react";

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
        <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full hover:bg-white/5">
          <Settings2 className="h-5 w-5 text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] border-white/10 bg-[#121212] text-foreground">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <SlidersHorizontal className="h-5 w-5 text-primary" />
            System Configuration
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground flex items-center justify-between">
              Assistant Personality
              <Button variant="link" className="text-xs p-0 h-auto" onClick={() => setPrompt(settings.systemPrompt)}>Reset</Button>
            </h4>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[150px] font-mono text-sm bg-black/50 border-white/10 resize-none focus-visible:ring-1 focus-visible:ring-primary"
              placeholder="You are BriefX, a local AI assistant..."
            />
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground">Data Management</h4>
            <div className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/[0.02]">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Export Conversations</p>
                <p className="text-xs text-muted-foreground">Download all your chat history as JSON.</p>
              </div>
              <Button variant="outline" size="sm" className="h-8 gap-2 border-white/10 hover:bg-white/5">
                <Download className="h-4 w-4" /> Export
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-red-500/20 bg-red-500/5">
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-red-500">Danger Zone</p>
                <p className="text-xs text-muted-foreground">Permanently delete all chats and data.</p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                className="h-8 gap-2"
                onClick={() => {
                  if (confirm("Are you sure you want to delete all chats? This cannot be undone.")) {
                    clearAllChats();
                  }
                }}
              >
                <Trash2 className="h-4 w-4" /> Clear All
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
