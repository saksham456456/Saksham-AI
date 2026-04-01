"use client";

import { AppSettings, ChatThread, ResponseStyle } from "@/lib/types";

const styles: ResponseStyle[] = [
  "Balanced",
  "Concise",
  "Detailed",
  "Study mode",
  "Coding mode",
  "Brutally honest mode"
];

export default function SettingsPanel({
  settings,
  modelLabel,
  onUpdate,
  onExport,
  onClearAll
}: {
  settings: AppSettings;
  modelLabel: string;
  onUpdate: (next: AppSettings) => void;
  onExport: () => void;
  onClearAll: () => void;
}) {
  return (
    <section className="space-y-4 rounded-2xl border bg-card/60 p-4 backdrop-blur">
      <h2 className="text-sm font-semibold">Settings</h2>
      <p className="text-xs text-muted">Model: {modelLabel}</p>
      <label className="flex items-center justify-between text-xs">
        Theme
        <select
          className="rounded-md border bg-transparent px-2 py-1"
          value={settings.theme}
          onChange={(e) => onUpdate({ ...settings, theme: e.target.value as "dark" | "light" })}
        >
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select>
      </label>
      <label className="flex items-center justify-between text-xs">
        Memory
        <input
          type="checkbox"
          checked={settings.memoryEnabled}
          onChange={(e) => onUpdate({ ...settings, memoryEnabled: e.target.checked })}
        />
      </label>
      <label className="block text-xs">
        Response style
        <select
          className="mt-1 w-full rounded-md border bg-transparent px-2 py-1"
          value={settings.responseStyle}
          onChange={(e) => onUpdate({ ...settings, responseStyle: e.target.value as ResponseStyle })}
        >
          {styles.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-xs">
        System prompt
        <textarea
          className="mt-1 min-h-28 w-full rounded-md border bg-transparent p-2"
          value={settings.systemPrompt}
          onChange={(e) => onUpdate({ ...settings, systemPrompt: e.target.value })}
        />
      </label>
      <div className="grid grid-cols-2 gap-2">
        <button className="rounded-md border px-2 py-2 text-xs" onClick={onExport}>
          Export chat
        </button>
        <button className="rounded-md border border-red-400/30 px-2 py-2 text-xs text-red-300" onClick={onClearAll}>
          Clear all data
        </button>
      </div>
      <div className="rounded-lg border border-dashed p-2 text-xs text-muted">PDF summarize/upload: coming soon.</div>
    </section>
  );
}
