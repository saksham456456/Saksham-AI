"use client";

import { useAppStore } from "@/lib/store";
import { Moon, Sun, AlertCircle, WifiOff, CheckCircle2, Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-destructive/10 text-destructive text-xs font-medium">
          <AlertCircle className="h-3.5 w-3.5" />
          WebGPU Unsupported
        </div>
      );
    }
    if (modelLoadError) {
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-destructive/10 text-destructive text-xs font-medium">
          <WifiOff className="h-3.5 w-3.5" />
          Load Failed
        </div>
      );
    }
    if (isModelLoading) {
      return (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span className="hidden sm:inline">{modelLoadProgress?.text || "Loading model..."}</span>
            <span className="sm:hidden">Loading...</span>
          </div>
          {modelLoadProgress && (
            <div className="hidden sm:flex items-center gap-1.5">
              <div className="w-24 h-1 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${(modelLoadProgress.progress || 0) * 100}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">
                {Math.round((modelLoadProgress.progress || 0) * 100)}%
              </span>
            </div>
          )}
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-medium">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Model Ready
      </div>
    );
  };

  return (
    <div className="h-[56px] border-b border-border bg-card flex items-center justify-between px-4 sticky top-0 z-10 shrink-0">
      {/* Status */}
      <div className="flex items-center gap-3">
        {getStatus()}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1">
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={cn(
              "h-8 w-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            {theme === "light" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        )}
      </div>
    </div>
  );
}
