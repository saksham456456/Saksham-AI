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
      <div className="flex h-screen items-center justify-center bg-background p-6">
        <div className="max-w-md w-full bg-card border border-destructive/20 rounded-xl p-8 text-center space-y-5 shadow-lg">
          <div className="mx-auto h-14 w-14 bg-destructive/10 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-7 w-7 text-destructive" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl font-semibold text-foreground">Browser Not Supported</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              BriefX requires <strong>WebGPU</strong> to run AI models locally. Your current browser or device does not support this feature.
            </p>
          </div>
          <div className="p-4 bg-muted rounded-lg text-left space-y-2 border border-border">
            <p className="text-sm font-medium text-foreground">Supported browsers</p>
            <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
              <li>Microsoft Edge 113+</li>
              <li>Google Chrome 113+</li>
              <li>Hardware acceleration must be enabled</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex flex-col flex-1 h-full w-full relative overflow-hidden">
        <TopBar />
        {modelLoadError ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <div className="max-w-sm text-center space-y-5 bg-card p-8 rounded-xl border border-destructive/20 shadow-lg">
              <div className="mx-auto h-14 w-14 bg-destructive/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-7 w-7 text-destructive" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-semibold text-foreground">Model Failed to Load</h3>
                <p className="text-sm text-muted-foreground">{modelLoadError}</p>
              </div>
              <Button
                onClick={() => loadModel()}
                className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
              >
                <DownloadCloud className="h-4 w-4" />
                Try Again
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
