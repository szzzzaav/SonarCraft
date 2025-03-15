"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";
import { Head } from "./Head";
import GridBackground from "./Grid";
import Community from "./community";
import { Create } from "./create";
import Lenis from "lenis";
import { Bottom } from "./Bottom";
import { DiskPlayer } from "./DiskPlayer";
export default function Home() {
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
  return (
    <div className="min-h-screen min-w-screen">
      <GridBackground />
      <Head />
      <DiskPlayer
        textPrimary={["Fly to the moon now", "Fly to the moon now", "Fly to the moon now"]}
        textSecondary="Throwback Music Vol"
        coverImg="/images/cover.png"
      />
      <Community />
      <Create />
      <Bottom />

      <div className="cursor"></div>
    </div>
  );
}
