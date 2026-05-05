import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Voice Diary",
  description: "AI-powered voice diary",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className="min-h-screen"
        style={{
          background: "linear-gradient(135deg, #faf8f3 0%, #f5f0e8 100%)",
          color: "#3d3d3d",
        }}
      >
        {children}
      </body>
    </html>
  );
}
