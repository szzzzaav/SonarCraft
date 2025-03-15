"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(MotionPathPlugin);
gsap.registerPlugin(useGSAP);

export const DiskPlayer = ({
  textPrimary,
  textSecondary,
  coverImg,
}: {
  textPrimary: string[];
  textSecondary: string;
  coverImg: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document
      .getElementById("def-1")
      ?.setAttribute("d", document.getElementById("path-1")?.getAttribute("d")!);

    document
      .getElementById("def-2")
      ?.setAttribute("d", document.getElementById("path-2")?.getAttribute("d")!);
  }, []);

  useGSAP(
    () => {
      const animateText = (selector: string, delay: number) => {
        gsap.to(selector, {
          attr: { startOffset: "100%" },
          ease: "linear",
          duration: 8,
          repeat: -1,
          delay: delay,
        });
      };

      animateText("#Text1", 0);
      animateText("#Text2", 4);
      animateText("#Text3", 8);

      gsap.to(".disk", {
        rotate: 360,
        duration: 6,
        repeat: -1,
        ease: "linear",
      });
    },
    { scope: containerRef }
  );

  return (
    <div className="container w-screen h-[180vh] overflow-hidden relative" ref={containerRef}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 350 350"
        width="800px"
        height="600px"
        id="text-primary"
        className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 overflow-visible font-sans text-[46px]"
      >
        <defs>
          <path id="def-1" className="fill-transparent" />
        </defs>
        <path
          id="path-1"
          d="M -393 405 C -53 405 -73 5 177 5 C 427 5 407 405 747 405"
          className="fill-transparent"
        />
        <text className="uppercase" fill="#fff">
          {textPrimary.map((text, index) => (
            <textPath
              key={index}
              id={`Text${index + 1}`}
              xlinkHref="#def-1"
              startOffset="-25%"
              fill="#fff"
            >
              {text}
            </textPath>
          ))}
        </text>
      </svg>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 350 350"
        width="600px"
        height="600px"
        id="text-secondary"
        className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 overflow-visible font-mono text-[20px]"
      >
        <defs>
          <path id="def-2" className="fill-transparent" />
        </defs>
        <path
          id="path-2"
          d="M -393 60 C -53 60 -70 365 180 365 C 421 352 407 60 725 56"
          className="fill-transparent"
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="end"
          textAnchor="middle"
          fill="#fff"
          className="uppercase"
        >
          <textPath id="Text5" xlinkHref="#def-2" startOffset="37%" fill="#fff">
            {textSecondary}
          </textPath>
        </text>
      </svg>

      <div className="disk absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full overflow-hidden">
        <Image
          src={"/images/disk.png"}
          alt="Disk Image"
          fill
          className="w-full h-full object-cover"
        />
        <div className="cover-img absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] rounded-full overflow-hidden">
          <Image src={coverImg} alt="Cover Image" fill className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
};
