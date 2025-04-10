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
  const [selectedInstruments, setSelectedInstruments] = useState<Instrument[]>([]);
  const [loading, setLoading] = useState(false);
  const [generatedResults, setGeneratedResults] = useState<Instrument[]>([]);

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

        // Call deepseek API to generate music data
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
      } else {
        // Handle other models if selected
        toast("Sonar model not implemented", {
          description: "Currently only Deepseek model is supported",
        });
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

  // Apply generated music data to instruments
  const handleApply = () => {
    if (!generatedResults.length) {
      toast("No generation results to apply", {
        description: "Please generate music data first",
      });
      return;
    }

    try {
      if (instruments) {
        // 根据所选模式处理数据
        const processedResults = generatedResults.map((instrument) => {
          // 查找原始乐器数据
          const originalInstrument = instruments.find(
            (i) => i.instrument === instrument.instrument && i.pitch === instrument.pitch
          );

          if (!originalInstrument || !originalInstrument.data) {
            return instrument; // 如果找不到原始乐器数据，直接使用生成的结果
          }

          // 计算索引位置
          const fromIndex = Math.floor(from * 4);
          const toIndex = Math.ceil(to * 4);

          if (applyMode === "cover") {
            // 覆盖模式：将to之后的内容替换为新生成的数据
            // 新数据 = 原始数据前部分(0到to) + 新生成的数据(to之后)
            return {
              ...instrument,
              data: [
                ...originalInstrument.data.slice(0, toIndex),
                ...instrument.data.slice(toIndex),
              ],
            };
          } else {
            // 扩展模式：保留原始数据，并添加新生成的内容
            // from到to之间的区域使用新生成的数据与原始数据合并
            const referenceSlice = originalInstrument.data.slice(fromIndex, toIndex);
            const combinedReferenceData = referenceSlice.map((value, index) => {
              if (value === 1) return 1; // 保留原始数据中的1
              if (index < instrument.data.length) return instrument.data[index]; // 否则使用新数据
              return value; // 如果新数据不够长，保持原始值
            });

            // 计算额外的新生成数据
            const durationIndex = Math.ceil(duration * 4);
            const additionalData = instrument.data.slice(0, durationIndex);

            // 原始数据的尾部
            const tailPart = originalInstrument.data.slice(toIndex);

            // 最终数据 = 前部分 + 合并的参考范围 + 额外数据 + 尾部分
            return {
              ...instrument,
              data: [
                ...originalInstrument.data.slice(0, fromIndex),
                ...combinedReferenceData,
                ...additionalData,
                ...tailPart,
              ],
            };
          }
        });

        // 更新存储
        setInstruments(processedResults);

        toast("Application successful", {
          description: `Music data applied to selected instruments, mode: ${applyMode === "cover" ? "Cover" : "Extend"}`,
        });

        // 清除生成的结果
        setGeneratedResults([]);
      }
    } catch (error) {
      console.error("Error applying music data:", error);
      toast("Application failed", {
        description: "Please try again later",
      });
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
      <div className="bg-zinc-900 rounded-lg w-[40%] h-[80vh] flex flex-col items-center justify-center relative gap-4">
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
            onClick={() => setModel("sonar")}
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
        <div className="flex items-start flex-col justify-start gap-x-10 w-[80%]  custom-scrollbar relative overflow-auto h-[60%]">
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
            <span className="text-zinc-400 text-sm font-bold">Duration (sec)</span>
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
                      // Convert index to time in seconds
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
                <p className="text-zinc-400 text-xs">Select application mode:</p>
                <div className="flex items-center gap-4">
                  <div
                    className={`flex items-center gap-1 cursor-pointer px-3 py-1 rounded-sm ${applyMode === "extend" ? "bg-zinc-700" : "bg-zinc-800"}`}
                    onClick={() => setApplyMode("extend")}
                  >
                    <Checkbox
                      className="border-zinc-700"
                      checked={applyMode === "extend"}
                      onCheckedChange={() => setApplyMode("extend")}
                    />
                    <span className="text-zinc-300 text-sm">Extend </span>
                    <span className="text-zinc-500 text-xs">(Preserve original data)</span>
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
                    <span className="text-zinc-300 text-sm">Cover </span>
                    <span className="text-zinc-500 text-xs">(Replace content after 'to')</span>
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
                      <span className="text-zinc-400 text-xs ml-1">Extend</span>
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
              >
                Cancel
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-500 transition-all duration-300 shadow-sm"
                onClick={handleApply}
              >
                Apply
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
