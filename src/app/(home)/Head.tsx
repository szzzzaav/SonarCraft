import { useEffect, useRef, useState } from "react";
import { Draggable } from "gsap/Draggable";
import gsap from "gsap";

import Img from "./img";
import { Title } from "./title";
import { Landing } from "@/components/ui/landing";
export const Head = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);
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
      <Title />
      <div
        className="container relative top-0 left-0 min-w-[500vw] h-[90vh] flex"
        style={{
          width: "500vw !important",
        }}
        ref={containerRef}
      >
        {/* <section
          className="relative w-screen h-full flex flex-col items-center justify-center overflow-hidden"
          style={{
            padding: "6em 2em",
          }}
        >
          <h1
            className="flex flex-col items-center uppercase text-[120px] leading-[0.9] font-normal tracking-tight"
            style={{
              fontFamily: "NT Dapper, sans-serif",
            }}
          >
            <span className="text-center">MUSIC STUDIO</span>
            <span className="w-[95%] text-center">INNOVATION</span>
            <span className="w-[60%] text-center">WITH</span>
            <span className="w-[85%] text-center">COMMUNITY</span>
            <span className="text-center">SPIRIT AND AI</span>
          </h1>
        </section> */}
        <Landing />

        <section
          className="relative w-screen h-full flex gap-[2em] overflow-hidden"
          style={{
            padding: "6em 2em 0 2em",
          }}
        >
          <div>
            <Img className="flex-[2]" src="/images/header/1.png" alt="" />
          </div>
          <div>
            <Img className="flex-[1]" src="/images/header/2.png" alt="" />
          </div>
          <div>
            <Img className="flex-[1]" src="/images/header/3.png" alt="" />
          </div>
        </section>

        <section
          className="relative w-screen h-full flex gap-[2em] overflow-hidden"
          style={{
            padding: "6em 2em 0 2em",
          }}
        >
          <div>
            <Img className="flex-[1]" src="/images/header/4.png" alt="" />
          </div>
          <div>
            <Img className="flex-[2]" src="/images/header/5.png" alt="" />
          </div>
          <div>
            <Img className="flex-[1]" src="/images/header/6.png" alt="" />
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
          <div>
            <Img className="flex-[1]" src="/images/header/7.png" alt="" />
          </div>
          <div>
            <Img className="flex-[2]" src="/images/header/8.png" alt="" />
          </div>
          <div>
            <Img className="flex-[1]" src="/images/header/9.png" alt="" />
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
