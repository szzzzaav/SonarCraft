"use client";
import { Head } from "./Head";
import { Bottom } from "./Bottom";
import { DiskPlayer } from "./DiskPlayer";
export default function Home() {
  return (
    <div className="min-h-screen min-w-screen">
      <Head />
      <DiskPlayer
        textPrimary={["Fly to the moon now", "Fly to the moon now", "Fly to the moon now"]}
        textSecondary="Throwback Music Vol"
        coverImg="/images/cover.png"
      />
      <Bottom />
    </div>
  );
}
