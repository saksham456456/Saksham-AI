# BriefX — Local-First AI Chat (Next.js + WebLLM)

BriefX is a production-ready private chatbot web app where inference happens directly inside the browser via WebGPU using WebLLM.

## Features

- Premium dark-first, responsive UX for desktop/mobile
- Local in-browser model runtime (no hosted AI API)
- Chat threads with local persistence (localStorage)
- System prompt editing + response style presets
- Markdown rendering with code block styling and copy
- Regenerate response, rename/delete/export/clear chats
- Local model loading states and failure diagnostics

## Tech Stack

- Next.js 15 + React 19 + TypeScript
- Tailwind CSS
- Framer Motion
- `@mlc-ai/web-llm`
- `react-markdown` + `remark-gfm`

## Folder Structure

```txt
app/
  globals.css
  layout.tsx
  page.tsx
components/
  MarkdownMessage.tsx
  MessageComposer.tsx
  SettingsPanel.tsx
  Sidebar.tsx
lib/
  model.ts
  prompt.ts
  storage.ts
  types.ts
public/
  briefx-logo.svg
```

## Installation

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Browser Requirements for Local AI

WebLLM requires WebGPU support. Recommended:

- Chrome (latest), Edge (latest), desktop
- Device with sufficient RAM/VRAM for selected model

If WebGPU is not available, the app shows a fallback error.

## Model Configuration

Edit `lib/model.ts`:

- `MODEL_ID` controls which WebLLM model loads.
- `getModelInfo` controls displayed metadata.

To swap model, replace `MODEL_ID` with a compatible WebLLM model id.

## Prompt Customization

- Default prompt: `lib/prompt.ts` (`DEFAULT_SYSTEM_PROMPT`)
- Runtime editor: Settings panel in the app

## Persistence

All app data is local in browser storage:

- chats: `briefx_chats_v1`
- settings: `briefx_settings_v1`
- active chat: `briefx_active_chat_v1`

These keys are managed in `lib/storage.ts`.
