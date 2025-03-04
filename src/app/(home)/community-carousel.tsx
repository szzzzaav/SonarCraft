"use client";

import { use, useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { usePaginatedQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Cards } from "./cards";
import { LoadingCarousel } from "./loading-carousel";
import { Doc } from "../../../convex/_generated/dataModel";
import { type CarouselApi } from "@/components/ui/carousel";

interface CommunityCarouselProps {
  user?: boolean;
}

export const CommunityCarousel = ({ user = false }: CommunityCarouselProps) => {
  const initialItemsToShow = 3;
  const itemsPerPage = 3;

  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [displayedItems, setDisplayedItems] = useState<Doc<"songs">[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const {
    results: communityResults,
    loadMore: loadMoreCommunity,
    status: communityStatus,
  } = usePaginatedQuery(api.songs.get, {}, { initialNumItems: initialItemsToShow });

  const {
    results: userProjects,
    loadMore: loadMoreUser,
    status: userStatus,
  } = usePaginatedQuery(api.songs.getUserProjects, {}, { initialNumItems: initialItemsToShow });

  const results = user ? userProjects : communityResults;
  const loadMore = user ? loadMoreUser : loadMoreCommunity;
  const status = user ? userStatus : communityStatus;

  const pageCount = results?.length ? Math.ceil(results.length / itemsPerPage) : 0;

  useEffect(() => {
    if (carouselApi) {
      carouselApi.on("select", () => {
        const currentIndex = carouselApi.selectedScrollSnap();
        setCurrentPage(currentIndex);
      });
    }
  }, [carouselApi]);

  useEffect(() => {
    if (results) {
      setDisplayedItems(results);
      setHasMore(status !== "Exhausted");
    }
  }, [results, status]);

  const handleLoadMore = async () => {
    if (hasMore && !isLoadingMore) {
      setIsLoadingMore(true);
      try {
        await loadMore(itemsPerPage);
      } catch (error) {
      } finally {
        setIsLoadingMore(false);
      }
    }
  };

  useEffect(() => {
    if (currentPage === pageCount - 1 && hasMore) {
      handleLoadMore();
    }
  }, [currentPage, pageCount, hasMore]);

  return (
    <Carousel className="w-full h-full carousel" setApi={setCarouselApi}>
      <CarouselContent>
        {!results && <LoadingCarousel />}
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
          Array.from({ length: pageCount }).map((_, index) => (
            <CarouselItem
              key={index}
              className="w-screen min-h-screen h-auto p-6"
              onClick={() => {
                setCurrentPage(index);
              }}
            >
              <Cards
                Song1={displayedItems[index * itemsPerPage]}
                Song2={displayedItems[index * itemsPerPage + 1]}
                Song3={displayedItems[index * itemsPerPage + 2]}
                user={user}
              />
            </CarouselItem>
          ))
        )}
      </CarouselContent>
      {results && results?.length > itemsPerPage && (
        <>
          <CarouselNext className="w-20 h-10 rounded-sm right-1 text-black" />
          <CarouselPrevious className="w-20 h-10 rounded-sm text-black" />
        </>
      )}
    </Carousel>
  );
};
