import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "INSTAFETCH - Ultra-Fast Instagram Video Downloader",
  description: "Download Instagram videos in highest quality. Ultra-fast, secure, and easy to use. No login required.",
  keywords: ["Instagram", "video downloader", "download Instagram videos", "Instagram reels downloader"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} gradient-bg min-h-screen`}>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "rgba(18, 18, 26, 0.95)",
              color: "#fff",
              border: "1px solid rgba(0, 255, 242, 0.3)",
              backdropFilter: "blur(20px)",
            },
          }}
        />
      </body>
    </html>
  );
}
