"use client";

import Lenis from "lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useEffect, useState } from "react";

export const Cursor = () => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
    gsap.set(".cursor", {
      force3D: true,
    });
    document.addEventListener("mousemove", (e) => {
      let x = e.clientX;
      let y = e.clientY;
      gsap.to(".cursor", {
        x: x - 16,
        y: y - 16,
        ease: "power3",
      });
    });
    document.body.addEventListener("mouseleave", () => {
      gsap.to(".cursor", {
        scale: 0,
        duration: 0.1,
        ease: "none",
      });
    });
    document.body.addEventListener("mouseenter", () => {
      gsap.to(".cursor", {
        scale: 1,
        duration: 0.1,
        ease: "none",
      });
    });
    let hoverCursors = document.querySelectorAll('[data-cursor="hover"]');
    hoverCursors.forEach(function (cursor) {
      cursor.addEventListener("mouseenter", () => {
        gsap.to(".cursor", {
          scale: 2.5,
        });
      });
      cursor.addEventListener("mouseleave", () => {
        gsap.to(".cursor", {
          scale: 1,
        });
      });
    });
  }, []);
  if (!isClient) return null;
  return <div className="cursor"></div>;
};
