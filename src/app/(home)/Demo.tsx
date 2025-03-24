"use client";

import { Button } from "@/components/ui/button";
import { Play, Pause, VolumeOff, Volume } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
export const Demo = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isWindow, setIsWindow] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setIsWindow(true);
  }, []);
  if (!isWindow) return null;
  return (
    <div className="relative w-screen h-[150vh] flex items-center justify-center z-10 gap-x-8">
      <div className="flex items-center justify-between ">
        <div
          className="text-white text-[120px] font-bold flex flex-col gap-0 leading-none"
          style={{
            fontFamily: "Impact",
            letterSpacing: "2px",
          }}
        >
          <div>
            <span className="text-indigo-500">C</span>ODE
          </div>
          <span className="text-white">WITH</span>
          <div>
            <span className="text-white">MUSI</span>
            <span className="text-rose-500">C</span>
          </div>
        </div>
      </div>
      <div className="p-3 rounded-2xl bg-zinc-800 gap-y-3 flex flex-col items-center justify-center">
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
    </div>
  );
};
