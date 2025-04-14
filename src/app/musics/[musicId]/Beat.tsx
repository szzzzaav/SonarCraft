"use client";

import { useState, useEffect } from "react";
import { SideBar } from "./SideBar";
import { TrackContainer } from "./TrackContainer";
import { Instrument } from "@/types/instruments";
import * as Tone from "tone";
import { useStorage, useMutation } from "@liveblocks/react";

interface BeatMakerProps {}

const Beat: React.FC<BeatMakerProps> = () => {
  const [currentBeat, setCurrentBeat] = useState(-1);
  const [startBeat, setStartBeat] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [samplers, setSamplers] = useState<Record<string, Tone.Sampler>>({});
  // 初始化音频采样器
  const col = (useStorage((root) => root.timeline) ?? 1) * 4;

  const instruments = useStorage((root) => root.instruments) ?? [];
  const setInstruments = useMutation(({ storage }, instruments: Instrument[]) => {
    storage.set("instruments", instruments);
  }, []);

  const initSampler = async (instrument: Instrument) => {
    if (!samplers[instrument.name]) {
      await Tone.start();
      const sampler = new Tone.Sampler({
        urls: {
          C4: `${instrument.pitch}.${instrument.instrument === "drums" || instrument.instrument === "bass" ? "wav" : "mp3"}`,
        },
        baseUrl: `/sounds/${instrument.instrument}/`,
        onload: () => {
          setSamplers((prev) => ({
            ...prev,
            [instrument.name]: sampler,
          }));
        },
      }).toDestination();
    }
  };
  // 播放当前节拍的所有乐器声音
  const playCurrentBeat = (beatIndex: number) => {
    instruments.forEach((instrument) => {
      if (instrument.data[beatIndex] === 1 && samplers[instrument.name]) {
        samplers[instrument.name].volume.value = -15;
        samplers[instrument.name].triggerAttackRelease("C4", "1n");
      }
    });
  };

  useEffect(() => {
    // 初始化所有乐器的采样器
    instruments.forEach(initSampler);
  }, [instruments]);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    if (isPlaying) {
      Tone.start();
      Tone.Transport.bpm.value = 120;

      intervalId = setInterval(() => {
        setCurrentBeat((prev) => {
          const nextBeat = (prev + 1) % (col * 4);
          playCurrentBeat(nextBeat);
          return nextBeat;
        });
      }, 250);
    } else {
      setCurrentBeat(startBeat);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPlaying, col, startBeat, instruments, samplers]);

  const setDataItem = (instrumentIndex: number, dataIndex: number) => {
    setInstruments(
      instruments.map((instrument, idx) =>
        idx === instrumentIndex
          ? {
              ...instrument,
              data: instrument.data.map((value, i) =>
                i === dataIndex ? (value === 0 ? 1 : 0) : value
              ),
            }
          : instrument
      )
    );
  };

  const handleSetStart = (beat: number) => {
    setStartBeat(beat);
    setCurrentBeat(beat);
    setIsPlaying(false);
  };

  return (
    <div className="w-full h-full rounded-lg border-2 border-neutral-800 flex flex-row py-2 overflow-auto custom-scrollbar gap-1 items-start bg-[rgba(0,0,0,0.3)] justify-start relative">
      <div className="sticky left-2 z-20">
        <SideBar
          count={col}
          instruments={instruments}
          setInstruments={setInstruments}
          currentBeat={currentBeat}
          setCurrentBeat={setCurrentBeat}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          handleSetStart={handleSetStart}
        />
      </div>
      <div className="ml-8">
        <TrackContainer
          col={col}
          instruments={instruments}
          setDataItem={setDataItem}
          currentBeat={currentBeat}
          setCurrentBeat={setCurrentBeat}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          startBeat={startBeat}
          setStartBeat={setStartBeat}
        />
      </div>
    </div>
  );
};

export default Beat;
