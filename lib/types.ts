export type Role = "user" | "assistant";

export type Message = {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
};

export type ResponseStyle =
  | "Balanced"
  | "Concise"
  | "Detailed"
  | "Study mode"
  | "Coding mode"
  | "Brutally honest mode";

export type ChatThread = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
};

export type AppSettings = {
  theme: "dark" | "light";
  memoryEnabled: boolean;
  systemPrompt: string;
  responseStyle: ResponseStyle;
};

export type LoadStage = {
  stage: string;
  progress: number;
};
