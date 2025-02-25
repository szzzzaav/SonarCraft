import { useState } from "react";
import { BsPlayFill, BsSoundwave, BsArrowCounterclockwise, BsPauseFill } from "react-icons/bs";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { Instrument } from "@/types/instruments";
import { useStorage, useMutation } from "@liveblocks/react";

interface TimelineProps {
  count: number;
  setCount: (val: number) => void;
  setInstruments: (val: Instrument[]) => void;
  instruments: Instrument[];
  currentBeat: number;
  setCurrentBeat: (beat: number) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  handleSetStart: (beat: number) => void;
}

const Timeline: React.FC<TimelineProps> = ({
  count,
  setCount,
  setInstruments,
  instruments,
  setCurrentBeat,
  isPlaying,
  setIsPlaying,
}) => {
  const duration = useStorage((root) => root.timeline) ?? 1;
  const setDuration = useMutation(({ storage }, time: number) => {
    storage.set("timeline", time);
  }, []);
  const handleAddTime = () => {
    const newDuration = duration + 1;
    setDuration(newDuration);
    setCount(count + 4);
    setInstruments(
      instruments.map((instrument) => ({
        ...instrument,
        data: [...instrument.data, ...Array(16).fill(0)],
      }))
    );
  };

  const handleReduceTime = () => {
    if (duration > 1) {
      const newDuration = duration - 1;
      setDuration(newDuration);
      setCount(count - 4);
      setInstruments(
        instruments.map((instrument) => ({
          ...instrument,
          data: instrument.data.slice(0, -16),
        }))
      );
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setCurrentBeat(0);
  };

  return (
    <div className="w-full flex justify-start h-[35px] box-border">
      <div className="flex flex-row items-center gap-4 px-5 w-auto justify-start py-2">
        <div className="flex items-center gap-2">
          <BsSoundwave className="text-neutral-200" />
          <span className="text-neutral-200 font-medium">TIMELINE</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReduceTime}
            className="p-1 bg-neutral-800 rounded hover:bg-neutral-700 text-neutral-200"
          >
            <AiOutlineMinus />
          </button>
          <span className="text-neutral-200 min-w-[40px] text-center">{duration}</span>
          <button
            onClick={handleAddTime}
            className="p-1 bg-neutral-800 rounded hover:bg-neutral-700 text-neutral-200"
          >
            <AiOutlinePlus />
          </button>
          {isPlaying ? (
            <button
              onClick={handlePause}
              className="p-1 bg-neutral-600 rounded hover:bg-neutral-700 text-neutral-200"
            >
              <BsPauseFill />
            </button>
          ) : (
            <button
              onClick={handlePlay}
              className="p-1 bg-neutral-800 rounded hover:bg-neutral-700 text-neutral-200"
            >
              <BsPlayFill />
            </button>
          )}
          <button
            onClick={handleReset}
            className="p-1 bg-neutral-800 rounded hover:bg-neutral-700 text-neutral-200"
          >
            <BsArrowCounterclockwise />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
