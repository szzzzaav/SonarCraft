import { useEffect, useRef, useState } from "react";
import { Draggable } from "gsap/Draggable";
import gsap from "gsap";

import { OptimizedImage } from "@/components/ui/image";
import { Landing } from "@/components/ui/landing";
export const Head = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    gsap.registerPlugin(Draggable);
    const timelineWidth = timelineRef.current?.offsetWidth || 0;
    const scrollerWidth = scrollerRef.current?.offsetWidth || 0;
    const gap = parseInt(window.getComputedStyle(document.body).fontSize);

    const maxDragX = timelineWidth - scrollerWidth - 2 * gap;

    for (let i = 0; i < 50; i++) {
      const marker = document.createElement("div");
      marker.classList.add("headMarker");
      timelineRef.current?.appendChild(marker);
    }

    Draggable.create(scrollerRef.current, {
      type: "x",
      bounds: {
        minX: gap,
        maxX: timelineWidth - scrollerWidth - gap,
      },
      onDrag: function () {
        let progress = (this.x - gap) / maxDragX;
        let containerX = -400 * (timelineWidth / 100) * progress;
        gsap.to(containerRef.current, {
          x: containerX,
          duration: 1,
          ease: "power3.out",
        });
      },
    });
  }, []);
  return (
    <div id="home" className="relative w-full h-[100vh]  text-[#fff]">
      <div
        className="container relative top-0 left-0 min-w-[500vw] h-[90vh] flex"
        style={{
          width: "500vw !important",
        }}
        ref={containerRef}
      >
        <Landing />

        <section
          className="relative w-screen h-full flex gap-[2em] overflow-hidden"
          style={{
            padding: "6em 2em 0 2em",
          }}
        >
          <div className="flex-[2]">
            <OptimizedImage
              src="/images/header/1.webp"
              alt="音乐创作界面"
              fill
              className="h-full"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
          <div className="flex-[1]">
            <OptimizedImage
              src="/images/header/2.webp"
              alt="音乐编辑器"
              fill
              className="h-full"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
          <div className="flex-[1]">
            <OptimizedImage
              src="/images/header/3.webp"
              alt="音乐社区"
              fill
              className="h-full"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        </section>

        <section
          className="relative w-screen h-full flex gap-[2em] overflow-hidden"
          style={{
            padding: "6em 2em 0 2em",
          }}
        >
          <div className="flex-[1]">
            <OptimizedImage
              src="/images/header/4.webp"
              alt="AI作曲"
              fill
              className="h-full"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
          <div className="flex-[2]">
            <OptimizedImage
              src="/images/header/5.webp"
              alt="协同编辑"
              fill
              className="h-full"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
          <div className="flex-[1]">
            <OptimizedImage
              src="/images/header/6.webp"
              alt="乐器选择"
              fill
              className="h-full"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        </section>
        <section
          className="relative w-screen h-full flex gap-[2em] overflow-hidden"
          style={{
            padding: "6em 2em 0 2em",
          }}
        >
          <h1
            className="w-[50%] font-normal uppercase text-[40px]"
            style={{
              fontFamily: "NT Dapper, sans-serif",
            }}
          >
            Transform your musical ideas into reality with our innovative tools and vibrant
            community.
            <br />
            Every song is a story, every note a journey. Join us in crafting a symphony of sound
            that resonates with your soul.
          </h1>
          <p className="w-[40%] font-normal text-[16px]"></p>
        </section>
        <section
          className="relative w-screen h-full flex gap-[2em] overflow-hidden"
          style={{
            padding: "6em 2em 0 2em",
          }}
        >
          <div className="flex-[1]">
            <OptimizedImage
              src="/images/header/7.webp"
              alt="音乐分享"
              fill
              className="h-full"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
          <div className="flex-[2]">
            <OptimizedImage
              src="/images/header/8.webp"
              alt="团队协作"
              fill
              className="h-full"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
          <div className="flex-[1]">
            <OptimizedImage
              src="/images/header/9.webp"
              alt="音乐评论"
              fill
              className="h-full"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        </section>
      </div>

      <div
        className="timeline absolute bottom-0 left-0 w-screen min-h-[10vh] flex justify-around"
        ref={timelineRef}
        style={{
          padding: "2.25em 1em",
          height: "80px",
        }}
      >
        <div
          className="scroller absolute top-[50%] left-0 uppercase bg-[#000] cursor-pointer"
          ref={scrollerRef}
          style={{
            transform: "translate(0%,-50%)",
            fontFamily: "Akkurat Mono, sans-serif",
            lineHeight: "120%",
          }}
        >
          <p>
            [
            <span
              className="text-[13px]"
              style={{
                padding: "0 3em",
              }}
            >
              Drag
            </span>
            ]
          </p>
        </div>
      </div>
    </div>
  );
};
