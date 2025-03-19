import type { Metadata } from "next";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import { Toaster } from "@/components/ui/sonner";
import { Title } from "./title";
import GridBackground from "./Grid";
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
        <GridBackground />
        <ConvexClientProvider>
          <Toaster />
          <div className="w-screen relative">
            <Title />
          </div>
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}
