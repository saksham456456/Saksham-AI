import { ChatCompletionMessageParam, CreateMLCEngine, InitProgressReport } from "@mlc-ai/web-llm";
import { LoadStage } from "./types";

const MODEL_ID = "Llama-3.1-8B-Instruct-q4f32_1-MLC";
let engine: Awaited<ReturnType<typeof CreateMLCEngine>> | null = null;

export const browserSupport = () => typeof navigator !== "undefined" && !!navigator.gpu;

export async function initModel(onStage: (stage: LoadStage) => void) {
  if (!browserSupport()) throw new Error("WebGPU is not available in this browser.");
  if (engine) return engine;

  onStage({ stage: "Initializing local model…", progress: 0.1 });
  engine = await CreateMLCEngine(MODEL_ID, {
    initProgressCallback: (report: InitProgressReport) => {
      const txt = report.text.toLowerCase();
      let stage = "Initializing local model…";
      if (txt.includes("download")) stage = "Downloading runtime assets…";
      if (txt.includes("prefill") || txt.includes("weight")) stage = "Loading weights…";
      const progress = Number.isFinite(report.progress) ? report.progress : 0.5;
      onStage({ stage, progress: Math.max(0.12, progress) });
    }
  });

  onStage({ stage: "Ready to chat", progress: 1 });
  return engine;
}

export async function streamReply(
  messages: ChatCompletionMessageParam[],
  onToken: (text: string) => void
): Promise<string> {
  if (!engine) throw new Error("Model not initialized.");
  let full = "";
  const response = await engine.chat.completions.create({
    stream: true,
    messages,
    temperature: 0.6,
    max_tokens: 800
  });

  for await (const chunk of response) {
    const token = chunk.choices?.[0]?.delta?.content ?? "";
    if (token) {
      full += token;
      onToken(full);
    }
  }

  return full;
}

export function getModelInfo() {
  return { id: MODEL_ID, runtime: "WebLLM + WebGPU" };
}
