"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { usePaginatedQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export const CommunityCarousel = () => {
  const songs = usePaginatedQuery(api.songs.get, {}, { initialNumItems: 8 });
  return (
    <Carousel className="w-full h-full carousel">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className="w-screen h-screen">
            <div className="w-full h-full flex items-center justify-center flex-col">
              <div className="flex w-full h-full justify-between items-center gap-10">
                <div className="w-[50%] h-[80%]">
                  <Skeleton className="w-full h-full bg-zinc-500" />
                </div>
                <div className="w-[50%] h-[80%]">
                  <Skeleton className="w-full h-full bg-zinc-500" />
                </div>
              </div>
              <div className="flex w-full h-full justify-between items-center gap-10">
                <div className="w-[50%] h-[80%]">
                  <Skeleton className="w-full h-full bg-zinc-500" />
                </div>
                <div className="w-[50%] h-[80%]">
                  <Skeleton className="w-full h-full bg-zinc-500" />
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselNext className="w-20 h-10 rounded-sm right-1 text-black" />
      <CarouselPrevious className="w-20 h-10 rounded-sm text-black" />
    </Carousel>
  );
};
