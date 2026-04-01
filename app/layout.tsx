import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BriefX | Private Local AI",
  description: "A premium local-first AI assistant running entirely in your browser"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
