"use client";

import { Button } from "@/components/ui/button";
import { Play, Pause, VolumeOff, Volume } from "lucide-react";
import { useEffect, useState, useRef } from "react";

import { FaCode, FaMusic } from "react-icons/fa6";
import { PiPlugsConnectedDuotone } from "react-icons/pi";

import Image from "next/image";
import Link from "next/link";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const Sticky = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isWindow, setIsWindow] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const serviceImgRef = useRef<HTMLDivElement>(null);
  const serviceHeight = 120;
  const imgHeight = 450;

  useEffect(() => {
    setIsWindow(true);
  }, []);

  useEffect(() => {
    if (!isWindow) return;

    const stickyHeight = window.innerHeight * 3;

    // 设置指示器初始位置
    gsap.set(indicatorRef.current, {
      y: 0, // 起始位置在MUSIC
    });

    const scrollTrigger = ScrollTrigger.create({
      trigger: stickyRef.current,
      start: "top top",
      end: `${stickyHeight}px`,
      pin: true,
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;

        gsap.to(progressRef.current, {
          scaleY: progress,
          duration: 0.1,
        });
        let indicatorPosition = 0;
        if (progress < 0.33) {
          indicatorPosition = 0; // MUSIC
        } else if (progress < 0.66) {
          indicatorPosition = serviceHeight; // WITH
        } else {
          indicatorPosition = serviceHeight * 2; // CODE
        }

        gsap.to(indicatorRef.current, {
          y: indicatorPosition,
          duration: 0.1,
        });

        if (serviceImgRef.current) {
          let translateY = 0;
          if (progress < 0.33) {
            translateY = 0;
          } else if (progress < 0.66) {
            translateY = -imgHeight;
          } else {
            translateY = -imgHeight * 2;
          }

          gsap.to(serviceImgRef.current, {
            y: translateY,
            duration: 0.1,
          });
        }
      },
    });

    return () => {
      scrollTrigger.kill();
    };
  }, [isWindow]);

  if (!isWindow) return null;

  return (
    <div className="relative w-screen h-[400vh]">
      <section className="relative w-screen h-screen flex" ref={stickyRef}>
        <div className="col flex-[1] flex flex-col items-center justify-center gap-[2em]">
          <div
            className="services relative flex flex-col items-start text-[120px] text-white text-center leading-none"
            style={{ fontFamily: "Impact", letterSpacing: "2px" }}
          >
            <div
              className="indicator absolute top-0 left-0 w-full h-[120px] bg-[#d5d5d5] z-[-1] transition-transform duration-300"
              ref={indicatorRef}
            ></div>
            <div className="service w-[max-content] h-[120px]">
              <div>
                <span>MUSI</span>
                <span className="text-rose-500">C</span>
              </div>
            </div>
            <div className="service w-[max-content] h-[120px]">
              <p>WITH</p>
            </div>
            <div className="service active w-[max-content] h-[120px]">
              <div>
                <span className="text-indigo-500">C</span>ODE
              </div>
            </div>
          </div>
        </div>
        <div className="progress-bar relative w-[2.5px] h-[60%] bg-[#909090] top-[50%] translate-y-[-50%]">
          <div
            className="progress absolute top-0 left-0 w-full h-full bg-[#fff] origin-top scaleY-0 will-change-transform"
            ref={progressRef}
          ></div>
        </div>
        <div className="col flex-[2] flex flex-col items-center justify-center gap-[2em]">
          <div className="service-img-wrapper relative w-[80%] h-[450px] overflow-hidden">
            <div
              className="service-img w-[800px] h-[1350px] will-change-transform transition-transform duration-300"
              ref={serviceImgRef}
            >
              <div className="p-3 rounded-2xl bg-zinc-800 gap-y-3 flex flex-col items-center justify-center h-[450px]">
                <video
                  src="/videos/play.mp4"
                  autoPlay={isPlaying}
                  muted
                  loop
                  ref={videoRef}
                  className="w-[800px] h-[350px] object-cover rounded-2xl"
                />
                <div className="flex w-full items-start justify-between gap-x-3">
                  <div className="flex items-center gap-x-3">
                    <Button
                      variant="default"
                      size="icon"
                      className="relative top-0 right-0 p-2 text-white"
                      onClick={() => {
                        setIsPlaying(!isPlaying);
                        if (videoRef.current) {
                          if (isPlaying) {
                            videoRef.current.pause();
                          } else {
                            videoRef.current.play();
                          }
                        }
                      }}
                    >
                      {isPlaying ? <Pause /> : <Play />}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="relative top-0 right-0 p-2 text-black"
                      onClick={() => {
                        setIsMuted(!isMuted);
                        if (videoRef.current) {
                          videoRef.current.muted = isMuted;
                        }
                      }}
                    >
                      {isMuted ? <Volume /> : <VolumeOff />}
                    </Button>
                  </div>
                  <div>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="relative p-2 text-black w-auto h-auto"
                    >
                      <Link href="/create" target="_blank">
                        Click here to create your own
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="img w-full h-[450px] flex items-center justify-center">
                <FaCode className="text-indigo-500 text-[120px]" />
                <PiPlugsConnectedDuotone className="text-white text-[120px]" />
                <FaMusic className="text-rose-500 text-[120px]" />
              </div>
              <div className="w-full h-[450px] p-3 rounded-2xl bg-zinc-800 gap-y-3 flex flex-col items-center justify-center">
                <Image
                  src="/images/code.webp"
                  alt="code"
                  className="object-cover w-[800px] h-[450px] rounded-2xl"
                  width={800}
                  height={450}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
