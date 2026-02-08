import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AnonPulse",
  description: "Anonymous feedback and questions for your team."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50">
        {children}
      </body>
    </html>
  );
}
