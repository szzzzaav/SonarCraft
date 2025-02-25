import { useState } from "react";
import { InstrumentModal } from "./InstrumentModal";
import { instrumentIcons } from "@/constants/instrumentIcons";
import { IoIosSettings } from "react-icons/io";
import { FaDeleteLeft } from "react-icons/fa6";
import { getRandomHexColor } from "@/utils/getRandomColor";
import { Instrument } from "@/types/instruments";
import { useOthers } from "@liveblocks/react";

interface InstrumentsProps {
  instruments: Instrument[];
  setInstruments: (instruments: Instrument[]) => void;
  count: number;
}

export const Instruments: React.FC<InstrumentsProps> = ({ instruments, setInstruments, count }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleAddInstrument = () => {
    setIsModalOpen(true);
  };

  const handleInstrumentSelect = (instrument: string, pitch: string) => {
    if (editingIndex !== null) {
      const newInstruments = [...instruments];
      newInstruments[editingIndex] = {
        ...instruments[editingIndex],
        name: `${instrument}-${pitch}`,
        instrument: instrument,
        pitch: pitch,
      };
      setInstruments(newInstruments);
      setEditingIndex(null);
    } else {
      const color = getRandomHexColor();
      setInstruments([
        ...instruments,
        {
          name: `${instrument}-${pitch}`,
          instrument: instrument,
          pitch: pitch,
          color: color,
          data: Array.from({ length: count * 4 }, () => 0),
          instrumentId: Date.now().valueOf() + Math.random() * 1024,
        },
      ]);
    }
    setIsModalOpen(false);
  };

  const handleEditInstrument = (index: number) => {
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  const handleDeleteInstrument = (index: number) => {
    const newInstruments = instruments.filter((_, i) => i !== index);
    setInstruments(newInstruments);
  };
  const users = useOthers();

  return (
    <div className="flex flex-col h-auto w-full bg-neutral-900 rounded select-none">
      {instruments.map((item, index) => {
        let isSelected = false;
        let selectedName = null;
        for (let i = 0; i < users.length; i++) {
          const { info, presence } = users[i];
          if (presence.selectedId === item.instrumentId) {
            isSelected = true;
            selectedName = info.name;
            console.log(item.color);
          }
        }
        const instrumentName = item.name.split("-")[0];
        return (
          <div
            key={index}
            className="w-full h-[36px] box-border bg-[#1e1e1e] flex items-center justify-center"
          >
            <div
              className="w-full h-[95%] text-neutral-200 font-medium flex items-center justify-between px-2 rounded border-[1px] box-border bg-neutral-700"
              style={{
                borderColor: isSelected ? item.color : "rgb(64,64,64,1)",
              }}
            >
              <div className="flex items-center">
                <span
                  className="w-4 h-4 rounded-full mr-1"
                  style={{
                    backgroundColor: item.color,
                  }}
                ></span>
                <span className="mr-2">
                  {instrumentIcons[instrumentName as keyof typeof instrumentIcons]}
                </span>
                <div className="max-w-[180px] overflow-hidden group" title={item.name}>
                  <div className="whitespace-nowrap overflow-hidden text-ellipsis">
                    <span className="inline-block group-hover:animate-marquee">{item.name}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEditInstrument(index)}
                  className="text-neutral-400 hover:text-neutral-200"
                >
                  <IoIosSettings size={16} />
                </button>
                <button
                  onClick={() => handleDeleteInstrument(index)}
                  className="text-neutral-400 hover:text-red-400"
                >
                  <FaDeleteLeft size={16} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
      <button
        onClick={handleAddInstrument}
        className="w-full h-[36px] bg-[#2e2e2e] text-neutral-200 hover:bg-[#3e3e3e] rounded mt-1"
      >
        + Add Instrument
      </button>
      <InstrumentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleInstrumentSelect}
      />
    </div>
  );
};
