import { toast } from "sonner";
import { Instrument } from "@/types/instruments";

export const checkSonarHealth = async (baseUrl: string = "http://localhost:8000") => {
  try {
    const response = await fetch(`${baseUrl}/health`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API Request Failed: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const showSonarHealthStatus = async () => {
  try {
    const healthData = await checkSonarHealth();

    if (healthData.status === "healthy") {
      toast.success("Sonar AI is ready", {
        description: `model loaded: ${healthData.model_loaded ? "yes" : "no"}`,
        duration: 2000,
      });

      return healthData;
    } else {
      toast.error("Sonar AI service is abnormal", {
        description: "The service may not be running properly",
        duration: 2000,
      });
    }
  } catch (error) {
    toast.error("something went wrong", {
      description: "Please ensure the API service is running and the model is correctly loaded",
      duration: 2000,
    });
    console.error(error);
    return null;
  }
};

// 鼓乐器映射表
const drumsMapping: Record<string, string> = {
  kickdry4: "A#1",
  kick: "A#1",
  snare: "D2",
  hihat: "F#2",
  crash: "A#3",
  tom: "E2",
  // 添加更多鼓映射
};

// 映射鼓乐器音符
const mapDrumPitch = (pitch: string): string => {
  // 如果已经是标准格式（如A#1）则直接返回
  if (/^[A-G](#|b)?\d$/.test(pitch)) {
    return pitch;
  }

  // 查找匹配的鼓类型
  for (const [drumType, mappedPitch] of Object.entries(drumsMapping)) {
    if (pitch.toLowerCase().includes(drumType.toLowerCase())) {
      return mappedPitch;
    }
  }

  // 默认返回A#1（基本鼓声）
  return "A#1";
};

// 获取对应乐器的音高
const getPitchWithOctave = (instrument: Instrument): string => {
  // 处理鼓乐器
  if (instrument.instrument === "drums") {
    return mapDrumPitch(instrument.pitch);
  }

  // 处理其他乐器
  return instrument.pitch.includes("-")
    ? instrument.pitch
    : instrument.pitch.match(/[A-G]#?\d/)
      ? instrument.pitch
      : `${instrument.pitch}4`;
};

export const generateWithSonar = async (
  selectedInstruments: Instrument[],
  from: number,
  to: number,
  duration: number,
  temperature: number,
  highDensityMode: boolean = false
): Promise<Instrument[] | null | undefined> => {
  try {
    const healthData = await showSonarHealthStatus();

    if (!healthData || !healthData.model_loaded) {
      toast.error("Sonar Unavailable", {
        description: "Please ensure the API service is running and the model is correctly loaded",
        duration: 2000,
      });
      return null;
    }

    const musicData: Record<string, Record<string, number[]>> = {};
    selectedInstruments.forEach((instrument) => {
      if (!musicData[instrument.instrument]) {
        musicData[instrument.instrument] = {};
      }

      const fromIndex = Math.floor(from * 4);
      const toIndex = Math.ceil(to * 4);

      const referenceData = instrument.data.slice(fromIndex, toIndex);
      const times: number[] = [];

      referenceData.forEach((value, idx) => {
        if (value === 1) {
          times.push(parseFloat(((fromIndex + idx) / 4).toFixed(2)));
        }
      });

      const pitchWithOctave = getPitchWithOctave(instrument);
      musicData[instrument.instrument][pitchWithOctave] = times;
    });

    toast.info("generating...", {
      duration: 1000,
    });
    console.log("发送到API的数据:", musicData);

    // 添加日志显示生成设置
    console.log(
      `生成设置: 拓展模式=启用, 时长=${duration + to}秒(从${to}开始), 温度=${temperature}, 音符密度=${highDensityMode ? 2.0 : 1.2}${highDensityMode ? ", 高密度模式=启用" : ""}`
    );

    // 添加更多参数适配新API
    const response = await fetch("http://localhost:8000/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: musicData,
        duration: duration + to,
        temperature: temperature,
        top_k: 50,
        top_p: 0.95,
        note_density: highDensityMode ? 2.0 : 1.2, // 高密度模式下使用更高的音符密度
        instruments: selectedInstruments.map((i) => i.instrument),
        extend_mode: true, // 启用API的拓展模式
        high_density_mode: highDensityMode, // 启用高密度模式
      }),
    });

    if (!response.ok) {
      throw new Error(`API Request Failed: ${response.status}`);
    }

    const data = await response.json();

    console.log("API 返回数据:", data);

    // 检查API返回是否包含新生成的乐器数据
    const hasNewInstruments =
      data &&
      Object.keys(data).some(
        (instName) => !selectedInstruments.some((i) => i.instrument === instName)
      );

    if (hasNewInstruments) {
      console.log("检测到API返回包含新生成的乐器");
    }

    // 记录是否使用了高密度模式
    if (highDensityMode) {
      console.log("高密度模式已启用，将生成更多音符");
    }

    const calculateAlignedLength = (baseLength: number): number => {
      const maxOriginalLength = Math.max(...selectedInstruments.map((inst) => inst.data.length));

      const requiredLength = Math.max(maxOriginalLength, Math.ceil((to + duration) * 4));

      const alignedLength = Math.ceil(requiredLength / 16) * 16;

      return alignedLength;
    };

    const createAlignedData = (length: number): number[] => {
      return Array(length).fill(0);
    };

    const alignedLength = calculateAlignedLength(Math.ceil((to + duration) * 4));

    const newInstruments: Instrument[] = [];

    if (data) {
      Object.keys(data).forEach((instrumentName) => {
        const existingInstrument = selectedInstruments.find(
          (inst) => inst.instrument === instrumentName
        );

        if (!existingInstrument) {
          const pitches = Object.keys(data[instrumentName]);

          pitches.forEach((pitch) => {
            const times: number[] = data[instrumentName][pitch];
            if (!Array.isArray(times) || times.length === 0) {
              console.warn(`跳过无效音符数据: ${instrumentName}-${pitch}`);
              return;
            }

            // 扩展支持的乐器列表
            const supportedInstruments = [
              "piano",
              "guitar",
              "bass",
              "drums",
              "strings",
              "synth",
              "brass",
              "woodwind",
            ];
            if (!supportedInstruments.includes(instrumentName)) {
              console.warn(`未知乐器类型: ${instrumentName}, 尝试添加`);
            }

            // 为不同乐器类型分配固定的颜色范围，使得同类乐器颜色相近
            let colorBase: string;
            switch (instrumentName) {
              case "piano":
                colorBase = "#4285F4";
                break; // 蓝色系
              case "guitar":
                colorBase = "#EA4335";
                break; // 红色系
              case "bass":
                colorBase = "#34A853";
                break; // 绿色系
              case "drums":
                colorBase = "#FBBC05";
                break; // 黄色系
              case "strings":
                colorBase = "#9C27B0";
                break; // 紫色系
              case "synth":
                colorBase = "#00BCD4";
                break; // 青色系
              case "brass":
                colorBase = "#FF9800";
                break; // 橙色系
              case "woodwind":
                colorBase = "#795548";
                break; // 棕色系
              default:
                colorBase = "#" + Math.floor(Math.random() * 16777215).toString(16);
            }

            // 根据音高轻微变化颜色，确保同一乐器不同音高有微妙差别
            const pitchNum = pitch.replace(/[^0-9]/g, "");
            const colorVariation = pitchNum ? parseInt(pitchNum) * 10 : 0;
            const colorHex = colorBase.replace(/^#/, "");
            const r = Math.min(255, parseInt(colorHex.substr(0, 2), 16) + colorVariation);
            const g = Math.min(255, parseInt(colorHex.substr(2, 2), 16) - colorVariation);
            const b = Math.min(255, parseInt(colorHex.substr(4, 2), 16) + colorVariation);
            const color = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;

            const newInstrument: Instrument = {
              name: `${instrumentName}-${pitch}`,
              instrument: instrumentName,
              pitch: pitch,
              color: color,
              data: createAlignedData(alignedLength),
              instrumentId: Date.now() + Math.random() * 1000, // 生成唯一ID
            };

            times.forEach((time: number) => {
              const index = Math.floor(time * 4);
              if (index < newInstrument.data.length) {
                newInstrument.data[index] = 1;
              }
            });

            // 检查是否包含实际的音符数据
            const hasNotes = newInstrument.data.includes(1);
            if (hasNotes) {
              newInstruments.push(newInstrument);
              console.log(
                `添加新乐器: ${newInstrument.name}, 包含 ${newInstrument.data.filter((v) => v === 1).length} 个音符`
              );
            } else {
              console.warn(`跳过空乐器: ${newInstrument.name}`);
            }
          });
        }
      });
    }

    const generatedResults = selectedInstruments.map((instrument) => {
      const newData = createAlignedData(alignedLength);

      // 保留from之前的原始数据
      instrument.data.slice(0, Math.floor(from * 4)).forEach((value, idx) => {
        newData[idx] = value;
      });

      if (data && data[instrument.instrument]) {
        const instrumentData = data[instrument.instrument];
        let pitchKey: string | undefined;
        const originalPitch: string = getPitchWithOctave(instrument);

        // 记录匹配过程，帮助调试
        console.log(
          `查找 ${instrument.instrument} 乐器的音高匹配，原始音高: ${instrument.pitch}, 标准化后: ${originalPitch}`
        );

        // 直接匹配
        if (instrumentData[originalPitch]) {
          pitchKey = originalPitch;
          console.log(`- 直接匹配成功: ${pitchKey}`);
        } else {
          // 模糊匹配
          pitchKey = Object.keys(instrumentData).find((key) => {
            if (instrument.instrument === "drums") {
              const mapped1 = mapDrumPitch(key);
              const mapped2 = mapDrumPitch(instrument.pitch);
              const isMatch = mapped1 === mapped2;
              if (isMatch) {
                console.log(
                  `- 鼓乐器匹配成功: ${key} => ${mapped1} 匹配 ${instrument.pitch} => ${mapped2}`
                );
              }
              return isMatch;
            }

            // 对于其他乐器，尝试匹配基本音高（不考虑八度）
            const pitchBase = originalPitch.replace(/\d+$/, "");
            if (key.startsWith(pitchBase)) {
              console.log(`- 前缀匹配成功: ${key} 以 ${pitchBase} 开头`);
              return true;
            }

            const keyBase = key.replace(/\d+$/, "");
            const isBaseMatch = keyBase === pitchBase;
            if (isBaseMatch) {
              console.log(
                `- 音高基础匹配成功: ${key} (${keyBase}) = ${originalPitch} (${pitchBase})`
              );
            }
            return isBaseMatch;
          });

          if (pitchKey) {
            console.log(`- 使用模糊匹配结果: ${pitchKey}`);
          } else {
            console.log(`- 未找到匹配项，可用音高: ${Object.keys(instrumentData).join(", ")}`);
          }
        }

        if (pitchKey && instrumentData[pitchKey]) {
          const times: number[] = instrumentData[pitchKey];
          console.log(`应用 ${instrument.instrument}-${pitchKey} 的 ${times.length} 个音符`);

          times.forEach((time: number) => {
            const index = Math.floor(time * 4);
            if (index < newData.length) {
              newData[index] = 1;
            }
          });
        }
      }
      return {
        ...instrument,
        data: newData,
      };
    });

    const allResults = [...generatedResults, ...newInstruments];

    const finalResults = allResults.map((instrument) => {
      if (instrument.data.length === alignedLength) {
        return instrument;
      }

      const alignedData = createAlignedData(alignedLength);

      // 复制原有数据
      instrument.data.forEach((value, idx) => {
        if (idx < alignedData.length) {
          alignedData[idx] = value;
        }
      });

      return {
        ...instrument,
        data: alignedData,
      };
    });

    if (newInstruments.length > 0) {
      const newInstrumentTypes = [...new Set(newInstruments.map((i) => i.instrument))];
      const newInstrumentNames = newInstruments.map((i) => i.name).slice(0, 3);
      const hasMore = newInstruments.length > 3;

      console.log(
        `生成了 ${newInstruments.length} 个新乐器，类型: ${newInstrumentTypes.join(", ")}`
      );
      toast.success(`已添加${newInstruments.length}个新乐器`, {
        description: `新增${newInstrumentTypes.length}种乐器类型: ${newInstrumentNames.join(", ")}${hasMore ? ` 等${newInstruments.length}个` : ""}`,
        duration: 3000,
      });
    } else {
      toast.success("生成成功", {
        description: `数据已对齐到${alignedLength / 4}秒（${alignedLength}帧）${highDensityMode ? " (高密度模式)" : ""}`,
        duration: 1000,
      });
    }

    return finalResults;
  } catch (error) {
    console.error("生成音乐时发生错误:", error);
    toast.error("生成过程中出现错误", {
      description: "请检查API服务是否正常运行",
      duration: 2000,
    });
    return null;
  }
};
