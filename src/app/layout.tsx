import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Taskly - Modern Task Management App",
    template: "%s | Taskly",
  },
  description:
    "Taskly is a sleek, modern task management app with drag-and-drop functionality, keyboard shortcuts.",
  keywords: [
    "task management",
    "productivity app",
    "kanban board",
    "todo app",
    "react",
    "typescript",
    "drag and drop",
  ],
  authors: [{ name: "Taskly Team" }],
  creator: "Taskly Team",
  publisher: "Taskly",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/TasklyLogo.png" type="image/png" />
        <link rel="shortcut icon" href="/TasklyLogo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/TasklyLogo.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
