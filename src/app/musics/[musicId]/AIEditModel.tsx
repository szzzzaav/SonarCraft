import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { InputOTP } from "@/components/ui/input-otp";
import { InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { instrumentIcons } from "@/constants/instrumentIcons";
import { Instrument } from "@/types/instruments";
import { useStorage } from "@liveblocks/react";
import { X } from "lucide-react";
import { useState } from "react";
import { FaItunes } from "react-icons/fa";
import { twMerge } from "tailwind-merge";

interface AIEditModelProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const AIEditModel = ({ open, setOpen }: AIEditModelProps) => {
  const instruments = useStorage((state) => state.instruments);
  const timeline = useStorage((state) => state.timeline);
  const [selectedInstruments, setSelectedInstruments] = useState<Instrument[]>([]);
  return (
    <div className="fixed w-screen h-screen z-50 bg-zinc-800/50 flex items-center justify-center">
      <div className="bg-zinc-900 rounded-lg w-[70%] h-auto p-10 flex flex-col items-center justify-center relative gap-4">
        <div className="flex items-center justify-end p-4 w-full absolute top-0 right-0">
          <Button
            variant="secondary"
            size="icon"
            className="bg-zinc-800/80 hover:bg-zinc-800 transition-all duration-300 shadow-sm"
            onClick={() => setOpen(false)}
          >
            <X className="size-4 font-bold text-zinc-200" />
          </Button>
        </div>
        <p className="text-zinc-200 text-lg uppercase font-bold">Select one AI model</p>
        <div className="flex items-center justify-center gap-x-10 w-[80%]">
          <div className="bg-zinc-800 rounded-sm px-6 py-4 flex items-center justify-center gap-2 hover:bg-zinc-700 transition-all duration-300 cursor-pointer">
            <span className="text-zinc-200 text-xl font-bold">SONAR</span>
            <FaItunes className="size-10 text-zinc-200" />
          </div>
          <div className="bg-zinc-800 rounded-sm px-6 py-4 flex items-center justify-center gap-2 hover:bg-zinc-700 transition-all duration-300 cursor-pointer">
            <span className="text-zinc-200 text-xl font-bold">DEEPSEEK</span>
            <img src="/deepseek-color.svg" alt="deepseek" className="size-10" />
          </div>
        </div>
        <div className="flex items-start flex-col justify-start gap-x-10 w-[80%] h-auto custom-scrollbar relative overflow-scroll max-h-[50vh]">
          <HeaderRow timeline={timeline} />
          {instruments &&
            instruments?.length > 0 &&
            instruments.map((instrument) => (
              <Row
                key={instrument.instrument + instrument.pitch}
                instrument={instrument}
                setSelectedInstruments={setSelectedInstruments}
                selectedInstruments={selectedInstruments}
              />
            ))}
        </div>
        <div className="w-[80%] flex items-center justify-between">
          <div className="p-2">
            <InputOTP maxLength={6} className="gap-2">
              <span className="text-zinc-400 text-sm font-bold">From</span>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator className="text-zinc-400">-</InputOTPSeparator>
              <span className="text-zinc-400 text-sm font-bold">To</span>
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-500 transition-all duration-300 shadow-sm">
            Generate
          </Button>
        </div>
      </div>
    </div>
  );
};

const Block = ({ fill }: { fill?: string }) => {
  return (
    <div
      className={twMerge(
        "w-[35px] h-[35px] box-border text-xs border-[1px] flex items-center justify-center border-zinc-700 rounded-sm",
        fill ? `bg-${fill}` : "bg-zinc-800"
      )}
    ></div>
  );
};

const HeaderRow = ({ timeline }: { timeline: number | null }) => {
  return (
    <div className="flex items-center justify-start gap-x-10 w-auto relative left-0">
      <div className="w-[180px] h-[36px] flex items-center px-5 py-1">
        <div className="flex items-center gap-x-2">
          <span className="w-4 h-4"></span>
          <span className="text-zinc-400 text-sm font-bold">Time</span>
        </div>
      </div>
      <div className="flex items-center">
        {timeline &&
          Array(timeline * 16)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="flex items-center">
                <span className="w-[35px] h-[35px] box-border text-xs border-[1px] flex items-center justify-center border-zinc-700 rounded-sm text-neutral-200">
                  {index % 4 === 0 ? (index / 4 + 1).toFixed(1) : ""}
                </span>
              </div>
            ))}
      </div>
    </div>
  );
};

const Row = ({
  instrument,
  setSelectedInstruments,
  selectedInstruments,
}: {
  instrument: Instrument;
  setSelectedInstruments: (instruments: Instrument[]) => void;
  selectedInstruments: Instrument[];
}) => {
  return (
    <div className="flex items-center justify-start gap-x-10 w-auto relative left-0">
      <div className="flex items-center bg-zinc-800 px-5 py-1 h-[35px] w-[180px] hover:bg-zinc-700 transition-all duration-300 cursor-pointer ">
        <div className="flex items-center gap-x-2 ">
          <span className="mr-2">
            {instrumentIcons[instrument.instrument as keyof typeof instrumentIcons]}
          </span>
          <span className="text-zinc-200 text-sm font-bold overflow-hidden text-ellipsis w-[90px] text-nowrap">
            {instrument.instrument + "-" + instrument.pitch}
          </span>
          <Checkbox
            className="border-zinc-700"
            onCheckedChange={() => {
              if (
                selectedInstruments.find(
                  (i) => i.instrument === instrument.instrument && i.pitch === instrument.pitch
                )
              ) {
                setSelectedInstruments(
                  selectedInstruments.filter(
                    (i) => i.instrument !== instrument.instrument || i.pitch !== instrument.pitch
                  )
                );
              } else {
                setSelectedInstruments([...selectedInstruments, instrument]);
              }
            }}
          />
        </div>
      </div>
      <div className="flex items-center">
        {instrument.data.map((note, index) => (
          <Block key={index} fill={note ? "indigo-500" : "transparent"} />
        ))}
      </div>
    </div>
  );
};

export default AIEditModel;
