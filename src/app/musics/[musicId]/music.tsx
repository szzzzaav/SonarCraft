"use client";

import Background from "./Background";
import Header from "./Header";
import Beat from "./Beat";
import { Room } from "./Room";
import { Threads } from "./threads";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Instrument } from "@/types/instruments";

interface SongProps {
  preloadedSong: Preloaded<typeof api.songs.getById>;
}

export const Music = ({ preloadedSong }: SongProps) => {
  const song = usePreloadedQuery(preloadedSong);
  return (
    <>
      <Background />
      <div className="h-screen flex items-center justify-center flex-col gap-2 p-2">
        <Room timeline={song.timeline ?? 1} instruments={(song.instruments as Instrument[]) ?? []}>
          <Header data={song} />
          <div className="w-full h-[80%] flex gap-0">
            <Beat />
            <Threads />
          </div>
        </Room>
      </div>
    </>
  );
};
