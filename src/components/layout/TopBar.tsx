"use client";

import { useAppStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Moon, Sun, AlertCircle, WifiOff } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function TopBar() {
  const { isModelLoading, webGPUSupported, modelLoadError, modelLoadProgress } = useAppStore();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const getStatus = () => {
    if (webGPUSupported === false) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1.5 shadow-sm">
          <AlertCircle className="h-3.5 w-3.5" />
          WebGPU Unsupported
        </Badge>
      );
    }
    if (modelLoadError) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1.5 shadow-sm">
          <WifiOff className="h-3.5 w-3.5" />
          Load Failed
        </Badge>
      );
    }
    if (isModelLoading) {
      return (
        <Badge variant="secondary" className="flex items-center gap-2 bg-primary/10 text-primary border-primary/20 shadow-sm">
          <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <span className="hidden sm:inline">{modelLoadProgress?.text || "Loading Model..."}</span>
          <span className="sm:hidden">Loading...</span>
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="flex items-center gap-2 border-green-500/20 bg-green-500/10 text-green-500 shadow-sm">
        <div className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
        Model Ready
      </Badge>
    );
  };

  return (
    <div className="h-[72px] border-b border-white/5 bg-background/50 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-10 shrink-0">
      <div className="flex items-center gap-4">
        {getStatus()}
      </div>

      {mounted && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="text-muted-foreground hover:bg-white/5 h-9 w-9 rounded-full"
        >
          {theme === "light" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          <span className="sr-only">Toggle theme</span>
        </Button>
      )}
    </div>
  );
}
