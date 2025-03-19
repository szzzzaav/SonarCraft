"use client";

import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { twMerge } from "tailwind-merge";

import { templates } from "./templates";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import Image from "next/image";

interface CardProps {
  img?: string;
  description?: string;
  empty?: boolean;
  onClick: () => void;
}

const Card = ({ img, description, empty, onClick }: CardProps) => {
  const [show, setShow] = useState(false);
  if (empty) {
    return <div className="card empty opacity-0"></div>;
  }

  return (
    <div
      onClick={onClick}
      className="card absolute w-[500px] h-[550px] top-[50%] left-[50%] ml-[-250px] flex flex-col gap-[1em]"
      style={{
        transformOrigin: "center center",
        willChange: "transform",
      }}
    >
      <div
        className="card-img overflow-hidden relative flex-[1] rounded-[0.5em]"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        <Image
          src={img || "/images/create/1.png"}
          alt=""
          className={twMerge(
            "w-full h-full object-cover  transition-all duration-300",
            show && "scale-110"
          )}
          width={500}
          height={500}
        />
        <div
          className={twMerge(
            "absolute top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center opacity-0 transition-all duration-300 cursor-pointer pointer-events-none",
            show && "opacity-100 pointer-events-auto"
          )}
        >
          <h1 className="text-white text-2xl font-bold">START</h1>
        </div>
      </div>
      <div className="card-content w-full h-[60px]">
        <p className="text-left text-[#fff] text-[16px] font-medium leading-[1.25]">
          {description}
        </p>
      </div>
    </div>
  );
};

export const Create = () => {
  const create = useMutation(api.songs.create);
  const [isCreating, setIsCreating] = useState(false);
  const stepsRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  const templateOnClick = (title: string, initialContent: string) => {
    setIsCreating(true);
    create({ title, initialContent })
      .then((songId) => {
        window.open(`/musics/${songId}`);
      })
      .finally(() => {
        setIsCreating(false);
      });
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !stepsRef.current || !cardsRef.current) return;

    ScrollTrigger.getAll().forEach((st) => st.kill());

    const stickyHeight = window.innerHeight * 7;
    const getRadius = () => {
      return window.innerWidth < 900 ? window.innerWidth * 7.5 : window.innerHeight * 2.5;
    };
    const arcAngle = Math.PI * 0.4;
    const startAngle = Math.PI / 2 - arcAngle / 2;

    gsap.registerPlugin(ScrollTrigger);
    const totalCards = cardsRef.current?.childNodes.length || 0;

    function positionCards(progress = 0) {
      const radius = getRadius();
      const totalTravel = 1 + totalCards / 7.5;
      const adjustedProgress = (progress * totalTravel - 1) * 0.75;

      cardsRef.current?.childNodes.forEach((card, i) => {
        const normalizedProgress = (totalCards - 1 - i) / totalCards;
        const cardProgress = normalizedProgress + adjustedProgress;
        const angle = startAngle + arcAngle * cardProgress;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const rotation = (angle - Math.PI / 2) * (180 / Math.PI);

        gsap.set(card, {
          x: x * 2,
          y: -y + radius - 40,
          rotation: -rotation,
          transformOrigin: "center center",
        });
      });
    }

    setTimeout(() => {
      ScrollTrigger.create({
        trigger: stepsRef.current,
        start: "top toppx",
        end: `+=${stickyHeight}px`,
        pin: true,
        pinSpacing: true,
        onUpdate: (self) => {
          positionCards(self.progress + 0.3);
        },
      });
      positionCards(0.3);

      ScrollTrigger.refresh();
    }, 100);

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [isClient]);

  return (
    <div
      id="create"
      className="container relative h-auto w-[100vw] p-10 flex flex-col justify-start items-center"
      style={{
        fontFamily: "Helvetica Now Display",
      }}
    >
      <section className="steps relative w-screen h-screen overflow-hidden" ref={stepsRef}>
        <div className="step-counter absolute flex flex-col m-[2em]">
          <div
            className="counter-title relative w-[1200px] h-[150px] overflow-hidden"
            style={{
              clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            }}
          >
            <div className="w-full flex justify-between items-center gap-40">
              <h1
                className="w-full relative font-[#fff] font-extrabold text-[150px] leading-[1] uppercase"
                style={{
                  willChange: "transform",
                  fontFamily: "PP Monument Extended",
                }}
              >
                Templates
              </h1>
              <h1
                className="w-full relative font-[#fff] font-extrabold text-[30px] leading-[1] uppercase"
                style={{
                  willChange: "transform",
                  fontFamily: "PP Monument Extended",
                }}
              >
                Scroll
              </h1>
            </div>
          </div>
          <div
            className="count relative w-[1200px] h-[150px] overflow-hidden top-[-10px]"
            style={{
              clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            }}
          >
            <div
              className="count-container relative translate-y-[150px]"
              style={{
                willChange: "transform",
              }}
              ref={countRef}
            >
              <h1
                className="w-full relative text-[#fff] uppercase font-extrabold text-[150px] leading-[1]"
                style={{
                  letterSpacing: "-0.04em",
                  willChange: "transform",
                  fontFamily: "PP Monument Extended",
                }}
              >
                01
              </h1>
              <h1
                className="w-full relative text-[#fff] uppercase font-extrabold text-[150px] leading-[1]"
                style={{
                  letterSpacing: "-0.04em",
                  willChange: "transform",
                  fontFamily: "PP Monument Extended",
                }}
              >
                02
              </h1>
              <h1
                className="w-full relative text-[#fff] uppercase font-extrabold text-[150px] leading-[1]"
                style={{
                  letterSpacing: "-0.04em",
                  willChange: "transform",
                  fontFamily: "PP Monument Extended",
                }}
              >
                03
              </h1>
              <h1
                className="w-full relative text-[#fff] uppercase font-extrabold text-[150px] leading-[1]"
                style={{
                  letterSpacing: "-0.04em",
                  willChange: "transform",
                  fontFamily: "PP Monument Extended",
                }}
              >
                04
              </h1>
              <h1
                className="w-full relative text-[#fff] uppercase font-extrabold text-[150px] leading-[1]"
                style={{
                  letterSpacing: "-0.04em",
                  willChange: "transform",
                  fontFamily: "PP Monument Extended",
                }}
              >
                05
              </h1>
            </div>
          </div>
        </div>

        <div
          className="cards absolute top-[25%] left-[50%] w-[150vw] h-[600px]"
          ref={cardsRef}
          style={{
            willChange: "transform",
            transform: "translate(-50%, -50%)",
          }}
        >
          {templates.map(({ img, description }, idx) => (
            <Card
              img={img}
              description={description}
              key={idx}
              onClick={() => templateOnClick(description, "")}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
