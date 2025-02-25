"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { usePaginatedQuery, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Cards } from "./cards";

const LoadingCarousel = () => {
  return Array.from({ length: 2 }).map((_, index) => (
    <CarouselItem key={index} className="w-screen h-screen">
      <div className="w-full h-auto flex items-center justify-center flex-col">
        <div className="flex w-full h-screen justify-between items-center gap-10">
          <div className="w-[50%] h-[70vh]">
            <Skeleton className="w-full h-full bg-zinc-500" />
          </div>
          <div className="w-[50%] h-[70vh]">
            <Skeleton className="w-full h-full bg-zinc-500" />
          </div>
        </div>
      </div>
    </CarouselItem>
  ));
};

interface CommunityCarouselProps {
  user?: boolean;
}
// add loadMore : 6:44
export const CommunityCarousel = ({ user = false }: CommunityCarouselProps) => {
  let results = undefined;
  const { results: CommunityResult } = usePaginatedQuery(api.songs.get, {}, { initialNumItems: 8 });
  const { results: UserProjects } = usePaginatedQuery(
    api.songs.getUserProjects,
    {},
    { initialNumItems: 8 }
  );
  if (!user) {
    results = CommunityResult;
  } else {
    results = UserProjects;
  }
  length = results?.length % 4 === 0 ? results?.length / 4 : Math.floor(results?.length / 4) + 1;

  return (
    <Carousel className="w-full h-full carousel">
      <CarouselContent>
        {results === undefined && <LoadingCarousel />}
        {results?.length === 0 ? (
          <CarouselItem>
            <div className="links pleaseLogIn">
              <div className="link relative">
                <a href="" className="text-[#fff] text-[48px] font-light leading-[125%]">
                  NO
                </a>
              </div>
              <div className="link relative">
                <a href="" className="text-[#fff] text-[48px] font-light leading-[125%]">
                  SONGS
                </a>
              </div>
              <div className="link relative">
                <a href="" className="text-[#fff] text-[48px] font-light leading-[125%]">
                  FOUND
                </a>
              </div>
            </div>
          </CarouselItem>
        ) : (
          Array.from({ length }).map((_, index) => (
            <CarouselItem key={index} className="w-screen min-h-screen h-auto p-6">
              <Cards
                Song1={results[index * 4]}
                Song2={results[index * 4 + 1]}
                Song3={results[index * 4 + 2]}
                user={user}
              />
            </CarouselItem>
          ))
        )}
      </CarouselContent>
      {results && results?.length !== 0 && (
        <>
          <CarouselNext className="w-20 h-10 rounded-sm right-1 text-black" />
          <CarouselPrevious className="w-20 h-10 rounded-sm text-black" />
        </>
      )}
    </Carousel>
  );
};
