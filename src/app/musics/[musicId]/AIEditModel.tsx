import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { instrumentIcons } from "@/constants/instrumentIcons";
import { Instrument } from "@/types/instruments";
import { useStorage, useMutation } from "@liveblocks/react";
import { X } from "lucide-react";
import { useState } from "react";
import { FaItunes } from "react-icons/fa";
import { twMerge } from "tailwind-merge";
import { generateMusicData } from "./deepseek";
import { toast } from "sonner";
import { Slider } from "@/components/ui/slider";
import { showSonarHealthStatus, generateWithSonar } from "./sendToSonarAi";

interface AIEditModelProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const AIEditModel = ({ open, setOpen }: AIEditModelProps) => {
  const instruments = useStorage((state) => state.instruments);
  const setInstruments = useMutation(({ storage }, instruments: Instrument[]) => {
    storage.set("instruments", instruments);
  }, []);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);
  const [duration, setDuration] = useState(10);
  const [model, setModel] = useState<"sonar" | "deepseek">("sonar");
  const [applyMode, setApplyMode] = useState<"cover" | "extend">("extend");
  const timeline = useStorage((state) => state.timeline);
  const setTimeline = useMutation(({ storage }, newTimeline: number) => {
    storage.set("timeline", newTimeline);
  }, []);
  const [selectedInstruments, setSelectedInstruments] = useState<Instrument[]>([]);
  const [loading, setLoading] = useState(false);
  const [generatedResults, setGeneratedResults] = useState<Instrument[]>([]);
  const [tempeature, setTempeature] = useState(0.5);

  const handleGenerate = async () => {
    if (!selectedInstruments.length) {
      toast("Please select at least one instrument", {
        description: "Check the instruments you want to generate music for",
      });
      return;
    }

    if (duration <= 0) {
      toast("Please enter a valid duration", {
        description: "Duration must be greater than 0",
      });
      return;
    }

    if (from < 0 || to <= 0 || from >= to) {
      toast("Please enter a valid range", {
        description: "Start position must be less than end position",
      });
      return;
    }

    setLoading(true);

    try {
      if (model === "deepseek") {
        const modeDescription =
          applyMode === "cover"
            ? "AI will generate new data and replace original content after 'to' position"
            : "AI will generate new data and merge with existing pattern, preserving all original data";

        toast.info("Generating music data...", {
          description: modeDescription,
        });

        const results = await generateMusicData(selectedInstruments, duration, from, to);
        setGeneratedResults(results);

        if (applyMode === "cover") {
          toast.success("Generation complete", {
            description: `New music data will replace original content after ${to}s, click "Apply" to confirm changes.`,
          });
        } else {
          toast.success("Generation complete", {
            description: `New music data has been merged with existing data, adding ${duration}s of new content after ${to}s while preserving all original data.`,
          });
        }
      } else if (model === "sonar") {
        const results = await generateWithSonar(
          selectedInstruments,
          from,
          to,
          duration,
          tempeature
        );

        if (results) {
          setGeneratedResults(results);
        }
      }
    } catch (error) {
      console.error("Error generating music data:", error);
      toast("Generation failed", {
        description: "Please try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!generatedResults.length) {
      toast("No generation results to apply", {
        description: "Please generate music data first",
      });
      return;
    }

    try {
      setLoading(true);

      if (instruments) {
        // 获取当前乐器的ID映射，用于处理新乐器
        const existingInstrumentMap = new Map<string, Instrument>();
        instruments.forEach((inst) => {
          existingInstrumentMap.set(`${inst.instrument}-${inst.pitch}`, inst);
        });

        // 处理生成结果
        const updatedInstruments: Instrument[] = [];
        const newInstruments: Instrument[] = [];

        // 计算新的最大时长
        let maxTimelineNeeded = timeline || 1;

        generatedResults.forEach((result) => {
          const key = `${result.instrument}-${result.pitch}`;
          const existingInstrument = existingInstrumentMap.get(key);

          if (existingInstrument) {
            // 处理现有乐器
            const fromIndex = Math.floor(from * 4);
            const toIndex = Math.ceil(to * 4);

            let newData: number[];

            if (applyMode === "cover") {
              // Cover模式：替换to之后的所有数据
              newData = [
                ...existingInstrument.data.slice(0, toIndex),
                ...result.data.slice(toIndex),
              ];
            } else {
              // Extend模式：在to位置插入生成的数据，保留原始数据
              const generatedSegment = result.data.slice(
                toIndex,
                toIndex + Math.ceil(duration * 4)
              );
              newData = [
                ...existingInstrument.data.slice(0, toIndex),
                ...generatedSegment,
                ...existingInstrument.data.slice(toIndex),
              ];
            }

            // 更新乐器数据
            updatedInstruments.push({
              ...existingInstrument,
              data: newData,
            });

            // 更新所需的timeline
            const requiredTimeline = Math.ceil(newData.length / 16);
            maxTimelineNeeded = Math.max(maxTimelineNeeded, requiredTimeline);

            // 从Map中移除已处理的乐器
            existingInstrumentMap.delete(key);
          } else {
            // 处理新乐器
            // 确保生成的结果符合当前的时间轴要求
            let newData = result.data;

            // 计算新乐器所需的timeline
            const requiredTimeline = Math.ceil(newData.length / 16);
            maxTimelineNeeded = Math.max(maxTimelineNeeded, requiredTimeline);

            newInstruments.push(result);
          }
        });

        // 处理未修改的原始乐器
        existingInstrumentMap.forEach((instrument) => {
          if (applyMode === "extend") {
            const toIndex = Math.ceil(to * 4);
            const insertLength = Math.ceil(duration * 4);

            const newData = [
              ...instrument.data.slice(0, toIndex),
              ...Array(insertLength).fill(0),
              ...instrument.data.slice(toIndex),
            ];

            updatedInstruments.push({
              ...instrument,
              data: newData,
            });
          } else {
            updatedInstruments.push(instrument);
          }
        });

        const finalInstruments = [...updatedInstruments, ...newInstruments];

        setTimeline(maxTimelineNeeded);

        setInstruments(finalInstruments);

        toast.success(`Applied ${applyMode === "cover" ? "Cover" : "Extend"} mode changes`, {
          description: `${updatedInstruments.length} instruments updated, ${newInstruments.length} new instruments added. Timeline: ${maxTimelineNeeded}`,
        });

        setGeneratedResults([]);
      }
    } catch (error) {
      console.error("Error applying changes:", error);
      toast.error("Failed to apply changes", {
        description: "An error occurred while applying the changes",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setGeneratedResults([]);
    toast("Cancelled", {
      description: "Generated music data cleared",
    });
  };

  return (
    <div className="fixed w-screen h-screen z-50 bg-zinc-800/50 flex items-center justify-center gap-4">
      <div className="bg-zinc-900 rounded-lg w-[40%] h-[80vh] flex flex-col items-center justify-center relative gap-4 py-10">
        <div className="flex items-center justify-end p-2 w-full absolute top-0 right-0">
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
        <div className="flex items-center justify-between w-[80%]">
          <div
            className={twMerge(
              "bg-zinc-800 rounded-sm px-3 py-1 flex items-center justify-center gap-2 hover:bg-zinc-700 transition-all duration-300 cursor-pointer",
              model === "sonar" && "bg-zinc-700"
            )}
            onClick={() => {
              setModel("sonar");
              showSonarHealthStatus();
            }}
          >
            <span className="text-zinc-200 text-sm font-bold">SONAR</span>
            <FaItunes className="size-10 text-zinc-200" />
          </div>
          <div
            className={twMerge(
              "bg-zinc-800 rounded-sm px-3 py-1 flex items-center justify-center gap-2 hover:bg-zinc-700 transition-all duration-300 cursor-pointer",
              model === "deepseek" && "bg-zinc-700"
            )}
            onClick={() => setModel("deepseek")}
          >
            <span className="text-zinc-200 text-sm font-bold">DEEPSEEK</span>
            <img src="/deepseek-color.svg" alt="deepseek" className="size-10" />
          </div>
        </div>
        <div className="h-[60%] relative w-[80%]">
          <div className="flex items-start flex-col justify-start gap-x-10 w-full custom-scrollbar relative overflow-auto h-auto max-h-full">
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
        </div>

        <div
          className={twMerge(
            "flex items-center justify-center gap-x-2 w-[80%] transition-all duration-300",
            model === "deepseek" && "opacity-0 pointer-events-none"
          )}
        >
          <span className="text-zinc-400 text-sm font-bold">{tempeature.toFixed(1)}</span>
          <Slider
            value={[tempeature]}
            onValueChange={(value) => setTempeature(value[0])}
            min={0}
            max={1}
            step={0.1}
            className="w-[80%] bg-slate-200 rounded-sm border-zinc-700 border-[1px]"
            style={{
              background: "linear-gradient(to right, #000000, #ffffff)",
            }}
            defaultValue={[tempeature]}
          />
          <span className="text-zinc-400 text-sm font-bold">Tempeature</span>
        </div>

        <div className="w-[80%] flex items-center justify-between">
          <div className="flex items-center justify-center gap-x-2">
            <span className="text-zinc-400 text-sm font-bold">(sec) From </span>
            <Input
              className="w-[40px] p-2"
              value={from}
              onChange={(e) => setFrom(Number(e.target.value))}
            />
            <span className="text-zinc-400 text-sm font-bold">To</span>
            <Input
              className="w-[40px] p-2"
              value={to}
              onChange={(e) => setTo(Number(e.target.value))}
            />
            <span className="text-zinc-400 text-sm font-bold">Generate Length (sec)</span>
            <Input
              className="w-[40px] p-2"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            />
          </div>
          <Button
            className="bg-indigo-600 hover:bg-indigo-500 transition-all duration-300 shadow-sm"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate"}
          </Button>
        </div>
      </div>
      <div className="bg-zinc-900 rounded-lg w-[40%] h-[80vh] p-10 flex flex-col items-center justify-start relative gap-4">
        <p className="text-zinc-200 text-lg uppercase font-bold w-full h-4 flex justify-between items-center">
          <span>Your Generation Result</span>
          {generatedResults.length > 0 && (
            <span className="text-sm font-normal text-zinc-400">
              Added {duration}s beyond {to}s
            </span>
          )}
        </p>
        <div className="flex items-start flex-col justify-start gap-x-10 w-full custom-scrollbar relative overflow-auto h-[85%] mt-8">
          {generatedResults.length > 0 ? (
            <>
              <HeaderRow timeline={(timeline ?? 0) + duration / 4} />
              {generatedResults.map((instrument) => (
                <div
                  key={instrument.instrument + instrument.pitch}
                  className="flex items-center justify-start gap-x-10 w-auto relative left-0"
                >
                  <div className="flex items-center bg-zinc-800 px-5 py-1 h-[35px] w-[180px]">
                    <div className="flex items-center gap-x-2 ">
                      <span
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: instrument.color }}
                      ></span>
                      <span className="mr-2">
                        {instrumentIcons[instrument.instrument as keyof typeof instrumentIcons]}
                      </span>
                      <span className="text-zinc-200 text-sm font-bold overflow-hidden text-ellipsis w-[90px] text-nowrap">
                        {instrument.instrument + "-" + instrument.pitch}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {instrument.data.map((note, index) => {
                      const timeInSeconds = index / 4;

                      let borderColor = "border-zinc-700"; // default

                      if (timeInSeconds >= from && timeInSeconds < to) {
                        borderColor = "border-yellow-500";
                      } else if (timeInSeconds >= to && timeInSeconds < to + duration) {
                        borderColor = "border-green-500";
                      }

                      return (
                        <div
                          key={index}
                          className={`w-[35px] h-[35px] box-border text-xs border-[1px] flex items-center justify-center rounded-sm ${
                            note ? "bg-indigo-500" : "bg-zinc-800"
                          } ${borderColor}`}
                          style={{
                            ...(timeInSeconds >= to &&
                              timeInSeconds < to + duration &&
                              applyMode === "extend" && {
                                boxShadow: "inset 0 0 2px 2px rgba(72, 187, 120, 0.3)",
                              }),
                          }}
                        >
                          {index % 4 === 0 ? Math.floor(index / 4) : ""}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="text-zinc-400 text-center w-full mt-10">
              {loading
                ? "Generating..."
                : "No generation results yet. Click Generate button to start."}
            </div>
          )}
        </div>
        {generatedResults.length > 0 && (
          <>
            <div className="flex items-center justify-between w-full mt-2">
              <div className="flex flex-col gap-2 w-full">
                <p className="text-zinc-400 text-xs">How to apply the generated data:</p>
                <div className="flex flex-col items-start gap-4">
                  <div
                    className={`flex items-center gap-1 cursor-pointer px-3 py-1 rounded-sm ${applyMode === "extend" ? "bg-zinc-700" : "bg-zinc-800"}`}
                    onClick={() => setApplyMode("extend")}
                  >
                    <Checkbox
                      className="border-zinc-700"
                      checked={applyMode === "extend"}
                      onCheckedChange={() => setApplyMode("extend")}
                    />
                    <span className="text-zinc-300 text-base">Insert </span>
                    <span className="text-zinc-500 text-sm">
                      (Insert generated data after 'to' and connect with original data)
                    </span>
                  </div>
                  <div
                    className={`flex items-center gap-1 cursor-pointer px-3 py-1 rounded-sm ${applyMode === "cover" ? "bg-zinc-700" : "bg-zinc-800"}`}
                    onClick={() => setApplyMode("cover")}
                  >
                    <Checkbox
                      className="border-zinc-700"
                      checked={applyMode === "cover"}
                      onCheckedChange={() => setApplyMode("cover")}
                    />
                    <span className="text-zinc-300 text-base">Cover </span>
                    <span className="text-zinc-500 text-sm">(Replace content after 'to')</span>
                  </div>
                </div>

                {/* Mode visualization */}
                <div className="flex flex-col mt-2">
                  <p className="text-zinc-400 text-xs mb-1">Mode effect example:</p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {/* Original data */}
                      <div className="w-5 h-5 border border-zinc-500 bg-zinc-800"></div>
                      <div className="w-5 h-5 border border-zinc-500 bg-zinc-800"></div>
                      {/* from~to range */}
                      <div className="w-5 h-5 border-2 border-yellow-500 bg-zinc-800"></div>
                      <div className="w-5 h-5 border-2 border-yellow-500 bg-zinc-800"></div>
                      {/* Original data after */}
                      <div className="w-5 h-5 border border-zinc-500 bg-zinc-800"></div>
                      <div className="w-5 h-5 border border-zinc-500 bg-zinc-800"></div>
                      <span className="text-zinc-400 text-xs ml-1">Original</span>
                    </div>
                  </div>

                  <div
                    className={`flex items-center gap-2 mt-1 ${applyMode === "extend" ? "opacity-100" : "opacity-50"}`}
                  >
                    <div className="flex items-center gap-1">
                      {/* Original data */}
                      <div className="w-5 h-5 border border-zinc-500 bg-zinc-800"></div>
                      <div className="w-5 h-5 border border-zinc-500 bg-zinc-800"></div>
                      {/* from~to range */}
                      <div className="w-5 h-5 border-2 border-yellow-500 bg-indigo-500"></div>
                      <div className="w-5 h-5 border-2 border-yellow-500 bg-indigo-500"></div>
                      {/* New generated part */}
                      <div className="w-5 h-5 border-2 border-green-500 bg-indigo-500"></div>
                      <div className="w-5 h-5 border-2 border-green-500 bg-indigo-500"></div>
                      {/* Original tail */}
                      <div className="w-5 h-5 border border-blue-500 bg-zinc-800"></div>
                      <div className="w-5 h-5 border border-blue-500 bg-zinc-800"></div>
                      <span className="text-zinc-400 text-xs ml-1">Insert</span>
                    </div>
                  </div>

                  <div
                    className={`flex items-center gap-2 mt-1 ${applyMode === "cover" ? "opacity-100" : "opacity-50"}`}
                  >
                    <div className="flex items-center gap-1">
                      {/* Original data */}
                      <div className="w-5 h-5 border border-zinc-500 bg-zinc-800"></div>
                      <div className="w-5 h-5 border border-zinc-500 bg-zinc-800"></div>
                      {/* from~to range */}
                      <div className="w-5 h-5 border-2 border-yellow-500 bg-indigo-500"></div>
                      <div className="w-5 h-5 border-2 border-yellow-500 bg-indigo-500"></div>
                      {/* New generated part(cover) */}
                      <div className="w-5 h-5 border-2 border-green-500 bg-indigo-500"></div>
                      <div className="w-5 h-5 border-2 border-green-500 bg-indigo-500"></div>
                      <span className="text-zinc-400 text-xs ml-1">Cover</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 w-full mt-auto">
              <Button
                variant="outline"
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-500 transition-all duration-300 shadow-sm"
                onClick={handleApply}
                disabled={loading}
              >
                {loading ? "Applying..." : "Apply"}
              </Button>
            </div>
          </>
        )}
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
  console.log(timeline);
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
                  {index % 4 === 0 ? (index / 4).toFixed(1) : ""}
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
