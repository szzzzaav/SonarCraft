import type { Metadata } from "next";
import "./globals.css";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import { Cursor } from "@/components/cursor";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "SonarCraft",
  description: "A platform for creating and sharing AI music",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ConvexClientProvider>
          <Toaster />
          {children}
          {/* <Cursor /> */}
        </ConvexClientProvider>
      </body>
    </html>
  );
}
