import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FIFA Card Generator | Player Rating Laboratory",
  description: "Advanced AI Football Scouting & Ultimate Team Player Rating Laboratory",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#080c14] text-slate-100 antialiased selection:bg-[#00ff87]/30 selection:text-[#00ff87]">
        {children}
      </body>
    </html>
  );
}
