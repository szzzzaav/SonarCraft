"use client";

import { twMerge } from "tailwind-merge";
import { Instrument } from "@/types/instruments";
import { playInstrumentSound } from "@/utils/instrumentUtils";
import { useUpdateMyPresence } from "@liveblocks/react";

interface RowItemProps {
  className?: string;
  data: Instrument;
  index: number;
  setDataItem?: (val: number, index: number) => void;
  instrumentIndex: number;
  isCurrentBeat?: boolean;
}

// 定义我们的Presence类型
interface MyPresence {
  selectedId: number | null;
  editingTrack: {
    instrumentId: number | null;
    instrumentName: string;
  };
}

const RowItem: React.FC<RowItemProps> = ({
  className,
  data,
  index,
  instrumentIndex,
  setDataItem,
  isCurrentBeat,
}) => {
  const updateMyPresence = useUpdateMyPresence();
  return (
    <div
      onClick={() => {
        setDataItem?.(instrumentIndex, index);
        const [instrument, note] = data.name.split("-");
        playInstrumentSound(
          instrument,
          note,
          instrument === "drums" || instrument === "bass" ? "wav" : "mp3"
        );
        // 更新当前用户的presence，包含正在编辑的音轨信息
        updateMyPresence({
          selectedId: data.instrumentId,
          editingTrack: {
            instrumentId: data.instrumentId,
            instrumentName: data.name,
          },
        } as Partial<MyPresence>);
      }}
      className={twMerge(
        "w-[35px] h-[35px] box-border text-xs border-[1px] flex items-center justify-center transition",
        isCurrentBeat ? "border-cyan-500" : "border-neutral-700",
        className
      )}
    >
      {!data.data[index] ? (
        <div
          className="w-[85%] h-[85%] box-border text-xs rounded-sm opacity-0 hover:opacity-100 ease-in-out duration-100 cursor-pointer"
          style={{
            backgroundColor: data.color,
          }}
        ></div>
      ) : (
        <div
          className="w-[85%] h-[85%] box-border text-xs rounded-sm ease-in-out duration-100 cursor-pointer"
          style={{
            backgroundColor: data.color,
          }}
        ></div>
      )}
    </div>
  );
};

export default RowItem;
