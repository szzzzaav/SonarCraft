"use client";
import { Head } from "./Head";
import { Bottom } from "./Bottom";
import { Sticky } from "./Demo";
export default function Home() {
  return (
    <div className="min-h-screen min-w-screen">
      <Head />
      <Sticky />
      <Bottom />
    </div>
  );
}
