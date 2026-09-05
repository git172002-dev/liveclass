import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AetherEd Admin — Futuristic Recorded Classes Platform",
  description: "Administrative console for managing students, courses, subscriptions, and video delivery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#090D16] text-slate-100 min-h-screen antialiased selection:bg-cyan-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
