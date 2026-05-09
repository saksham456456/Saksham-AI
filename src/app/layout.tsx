import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import "./globals.css";

// Segoe UI is a system font on Windows; Inter is the closest web-safe substitute.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata = {
  title: "BriefX | Local AI Assistant",
  description:
    "A privacy-first local AI assistant running entirely in the browser. Powered by WebGPU.",
  themeColor: "#0078D4",
};

export const viewport = {
  themeColor: "#0078D4",
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans bg-background text-foreground antialiased min-h-screen flex flex-col selection:bg-primary/20 selection:text-primary`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
