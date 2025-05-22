import type { Metadata } from "next";
import "./globals.css";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import { Cursor } from "@/components/cursor";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "SonarCraft",
  description: "A platform for creating and sharing AI music",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  keywords: ["音乐创作", "AI音乐", "协同编辑", "音乐社区"],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* 预加载关键资源 */}
        <link
          rel="preload"
          href="/images/cover.webp"
          as="image"
          type="image/webp"
          fetchPriority="high"
        />

        {/* 预连接第三方资源 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* DNS预取 */}
        <link rel="dns-prefetch" href="https://api.clerk.dev" />

        {/* 预加载关键字体 */}
        <link
          rel="preload"
          href="/fonts/inter-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <ConvexClientProvider>
          <Toaster />
          {children}
          <Cursor />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
