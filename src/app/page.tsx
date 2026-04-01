"use client";

import { useAppStore } from "@/lib/store";
import { useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { ChatArea } from "@/components/chat/ChatArea";
import { AlertTriangle, DownloadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { initApp, loadModel, webGPUSupported, modelLoadError } = useAppStore();

  useEffect(() => {
    initApp();
  }, [initApp]);

  useEffect(() => {
    if (webGPUSupported) {
      loadModel();
    }
  }, [webGPUSupported, loadModel]);

  if (webGPUSupported === false) {
    return (
      <div className="flex h-screen items-center justify-center bg-background p-4 flex-col">
        <div className="max-w-md w-full bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center space-y-6 shadow-2xl">
          <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center shadow-inner">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-white">Browser Not Supported</h2>
            <p className="text-muted-foreground">
              BriefX requires <strong>WebGPU</strong> to run AI models locally. Your current browser or device does not support this feature yet.
            </p>
          </div>
          <div className="p-4 bg-black/40 rounded-lg text-left border border-white/5 space-y-3">
            <p className="text-sm font-medium text-white">Try these browsers:</p>
            <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
              <li>Google Chrome (version 113+)</li>
              <li>Microsoft Edge (version 113+)</li>
              <li>Ensure hardware acceleration is enabled</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex flex-col flex-1 h-full w-full relative">
        <TopBar />
        {modelLoadError ? (
          <div className="flex-1 flex flex-col items-center justify-center p-4">
            <div className="max-w-md text-center space-y-6 bg-red-500/5 p-8 rounded-3xl border border-red-500/10">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
              <div>
                <h3 className="text-xl font-bold mb-2">Model Failed to Load</h3>
                <p className="text-muted-foreground text-sm">{modelLoadError}</p>
              </div>
              <Button onClick={() => loadModel()} className="bg-red-500 hover:bg-red-600 text-white">
                <DownloadCloud className="mr-2 h-4 w-4" /> Try Again
              </Button>
            </div>
          </div>
        ) : (
          <ChatArea />
        )}
      </main>
    </div>
  );
}
