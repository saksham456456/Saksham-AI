import { CreateMLCEngine, MLCEngine, InitProgressCallback, ChatCompletionMessageParam, InitProgressReport } from "@mlc-ai/web-llm";

export const DEFAULT_MODEL = "Phi-3-mini-4k-instruct-q4f16_1-MLC";

export class WebLLMService {
  private engine: MLCEngine | null = null;
  private isLoaded = false;
  private progressCallback: InitProgressCallback | null = null;
  private currentModel = "";

  public setProgressCallback(callback: InitProgressCallback) {
    this.progressCallback = callback;
  }

  public async loadModel(modelId: string = DEFAULT_MODEL) {
    if (this.engine && this.currentModel === modelId) {
      return this.engine;
    }

    try {
      this.isLoaded = false;
      this.currentModel = modelId;

      const initProgressCallback = (progress: InitProgressReport) => {
        if (this.progressCallback) {
          this.progressCallback(progress);
        }
      };

      this.engine = await CreateMLCEngine(modelId, {
        initProgressCallback,
      });

      this.isLoaded = true;
      return this.engine;
    } catch (error) {
      console.error("Failed to load model:", error);
      this.engine = null;
      this.isLoaded = false;
      throw error;
    }
  }

  public async *generateResponseStream(messages: ChatCompletionMessageParam[], temperature = 0.7) {
    if (!this.engine) {
      throw new Error("Model not loaded");
    }

    try {
      const asyncChunkGenerator = await this.engine.chat.completions.create({
        messages,
        temperature,
        stream: true,
      });

      for await (const chunk of asyncChunkGenerator) {
        if (chunk.choices[0]?.delta?.content) {
          yield chunk.choices[0].delta.content;
        }
      }
    } catch (error) {
      console.error("Generation error:", error);
      throw error;
    }
  }

  public isReady() {
    return this.isLoaded && this.engine !== null;
  }
}

export const webLLM = new WebLLMService();
