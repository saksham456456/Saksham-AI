import Dexie, { type Table } from 'dexie';

export interface Chat {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
}

export interface Message {
  id: string;
  chatId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: number;
}

export interface Settings {
  id: string; // 'default'
  systemPrompt: string;
  model: string;
  temperature: number;
}

export class BriefXDatabase extends Dexie {
  chats!: Table<Chat>;
  messages!: Table<Message>;
  settings!: Table<Settings>;

  constructor() {
    super('BriefXDatabase');
    this.version(1).stores({
      chats: 'id, updatedAt', // Primary key and indexed props
      messages: 'id, chatId, createdAt',
      settings: 'id',
    });
  }
}

export const db = new BriefXDatabase();

export const defaultSystemPrompt = `You are BriefX, a privacy-first local AI assistant running entirely in the browser.

Rules:
1. Be direct, accurate, and useful.
2. Prefer clarity over long explanations.
3. Use short paragraphs and structured formatting when helpful.
4. If the user is wrong, explain why plainly.
5. If something is uncertain, say so clearly.
6. Never claim to access the internet.
7. Never mention external APIs because this app is local-first.
8. Keep the tone intelligent, modern, and clean.`;
