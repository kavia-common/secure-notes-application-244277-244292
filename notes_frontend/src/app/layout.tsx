import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { NotesProvider } from "./context/NotesContext";

export const metadata: Metadata = {
  title: "Retro Secure Notes",
  description: "Password-protected Secure Notes with Retro Theme",
};

// Simple font import
const IBMPlexMonoFont = `<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;700&display=swap" rel="stylesheet">`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head dangerouslySetInnerHTML={{ __html: IBMPlexMonoFont }} />
      <body suppressHydrationWarning>
        <AuthProvider>
          <NotesProvider>
            {children}
          </NotesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
