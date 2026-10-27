import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "AmanaLink — escrow & delivery prototype",
  description:
    "Interactive prototype of a Kenyan escrow and delivery flow for WhatsApp and Instagram vendors. Mock data only — no real payments.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f7f6" },
    { media: "(prefers-color-scheme: dark)", color: "#080d0b" },
  ],
};

/** Applies the stored theme before paint so there is no light/dark flash. */
const themeScript = `(function(){try{var stored=localStorage.getItem("amana.theme");var dark=stored?stored==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",dark);}catch(e){}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-dvh flex-col bg-bg font-sans text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
