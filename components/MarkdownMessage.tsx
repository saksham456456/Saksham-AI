"use client";

import { Copy } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownMessage({ content }: { content: string }) {
  return (
    <div className="group relative">
      <button
        className="absolute right-2 top-2 rounded-md bg-white/10 p-1.5 text-xs opacity-0 transition group-hover:opacity-100"
        onClick={() => navigator.clipboard.writeText(content)}
        aria-label="Copy response"
      >
        <Copy className="h-3.5 w-3.5" />
      </button>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          pre: ({ children }) => <pre className="my-3 overflow-auto rounded-lg bg-black/40 p-3 text-sm">{children}</pre>,
          code: ({ children, className }) => (
            <code className={`rounded bg-black/35 px-1.5 py-0.5 text-[13px] ${className ?? ""}`}>{children}</code>
          ),
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noreferrer" className="text-cyan-300 underline">
              {children}
            </a>
          )
        }}
        className="prose prose-invert max-w-none text-sm leading-7 prose-p:my-2 prose-headings:my-3"
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
