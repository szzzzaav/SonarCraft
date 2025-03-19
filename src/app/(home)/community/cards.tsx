"use client";

import { Doc } from "../../../../convex/_generated/dataModel";
import { SongCard } from "./song-card";

interface CardsProps {
  Song1: Doc<"songs">;
  Song2: Doc<"songs">;
  Song3: Doc<"songs">;
  user?: boolean;
}

export const Cards = ({ Song1, Song2, Song3, user = false }: CardsProps) => {
  return (
    <div className="w-full h-auto flex items-center justify-center relative">
      <div
        className="cards flex w-full h-screen justify-between items-center gap-y-20 gap-x-5 
      "
      >
        <div className="w-[50%] h-full">
          <SongCard Song={Song1} delay={0} user={user} />
        </div>
        <div className="w-[50%] h-full">
          <SongCard Song={Song2} delay={0.2} user={user} />
        </div>
        <div className="w-[50%] h-full">
          <SongCard Song={Song3} delay={0.4} user={user} />
        </div>
      </div>
    </div>
  );
};
