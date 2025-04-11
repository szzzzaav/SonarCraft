"use client";

import { useThreads } from "@liveblocks/react/suspense";
import { Composer, Thread } from "@liveblocks/react-ui";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MdDragIndicator } from "react-icons/md";
import { useState } from "react";
import Image from "next/image";
export function Threads() {
  const { threads } = useThreads();
  const [open, setOpen] = useState(true);
  return (
    <div className="w-auto flex gap-0">
      <div
        className="h-full flex items-center w-[15px] rounded-lg hover:bg-slate-900 transition-all mx-1 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <MdDragIndicator size={30} />
      </div>
      {open && (
        <ScrollArea className="w-[38vw] h-full rounded-lg bg-[#fff] relative m-0 p-0">
          {threads.map((thread) => (
            <Thread key={thread.id} thread={thread} className="text-[#000]" />
          ))}
          {threads.length === 0 && (
            <div className="text-[#000] text-2xl font-semibold w-[38vw] h-[80vh] flex items-center justify-between flex-col p-10">
              <div className="flex w-full items-center justify-start gap-4">
                <Image
                  src="/images/cover.png"
                  alt="logo"
                  width={60}
                  height={60}
                  className="rounded-full"
                />
                <div className="flex flex-col items-start justify-start w-full">
                  <span className="font-medium text-base">SonarCraft-BeatMaker</span>
                  <span className="text-sm text-muted-foreground">
                    Hey there! Welcome to the send a message with your group member
                  </span>
                </div>
              </div>
              <Composer className="w-full p-2" />
            </div>
          )}
        </ScrollArea>
      )}
    </div>
  );
}
