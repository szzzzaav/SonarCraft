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
        description: `model loaded: ${healthData.model_loaded ? "yes" : "no"}, device: ${healthData.device}`,
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

export const generateWithSonar = async (
  selectedInstruments: Instrument[],
  from: number,
  to: number,
  duration: number,
  temperature: number
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

      const pitchWithOctave = instrument.pitch.includes("-")
        ? instrument.pitch
        : instrument.pitch.match(/[A-G]#?\d/)
          ? instrument.pitch
          : `${instrument.pitch}4`;

      musicData[instrument.instrument][pitchWithOctave] = times;
    });

    toast.info("generating...", {
      duration: 1000,
    });
    console.log("musicData", musicData);
    const response = await fetch("http://localhost:8000/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        music_data: musicData,
        duration: duration,
        temperature: temperature,
        top_k: 50,
        top_p: 0.95,
        quantize: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`API Request Failed: ${response.status}`);
    }

    const data = await response.json();

    // 检查是否有新的乐器
    const newInstruments: Instrument[] = [];

    if (data.generated_music) {
      // 遍历服务器返回的所有乐器
      Object.keys(data.generated_music).forEach((instrumentName) => {
        // 检查这个乐器是否在已选择的乐器中
        const existingInstrument = selectedInstruments.find(
          (inst) => inst.instrument === instrumentName
        );

        // 如果这是一个新的乐器
        if (!existingInstrument) {
          // 获取该乐器的所有音符
          const pitches = Object.keys(data.generated_music[instrumentName]);

          // 为每个音符创建一个新的乐器实例
          pitches.forEach((pitch) => {
            // 验证音符数据是否有效
            const times: number[] = data.generated_music[instrumentName][pitch];
            if (!Array.isArray(times) || times.length === 0) {
              console.warn(`skip invalid note data: ${instrumentName}-${pitch}`);
              return; // 跳过这个音符
            }

            const supportedInstruments = ["piano", "guitar", "bass", "drums"];
            if (!supportedInstruments.includes(instrumentName)) {
              console.warn(`unknown instrument type: ${instrumentName}, will try to add`);
            }

            const newInstrument: Instrument = {
              name: `${instrumentName}-${pitch}`,
              instrument: instrumentName,
              pitch: pitch,
              color: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // 随机颜色
              data: Array(Math.ceil((to + duration) * 4)).fill(0),
              instrumentId: Date.now() + Math.random() * 1000, // 生成唯一ID
            };

            // 填充音符数据
            times.forEach((time: number) => {
              const index = Math.floor(time * 4);
              if (index < newInstrument.data.length) {
                newInstrument.data[index] = 1;
              }
            });

            if (newInstrument.data.includes(1)) {
              newInstruments.push(newInstrument);
              console.log(`添加新乐器: ${newInstrument.name}, 音符数量: ${times.length}`);
            } else {
              console.warn(`跳过空乐器: ${newInstrument.name}`);
            }
          });
        }
      });
    }

    const generatedResults = selectedInstruments.map((instrument) => {
      const newData = Array(Math.ceil((to + duration) * 4)).fill(0);

      instrument.data.slice(0, Math.floor(from * 4)).forEach((value, idx) => {
        newData[idx] = value;
      });

      if (data.generated_music && data.generated_music[instrument.instrument]) {
        const instrumentData = data.generated_music[instrument.instrument];

        const pitchKey = Object.keys(instrumentData).find((key) => {
          if (key === instrument.pitch) return true;

          const pitchBase = instrument.pitch.replace(/\d+$/, "");
          if (key.startsWith(pitchBase)) return true;

          const keyBase = key.replace(/\d+$/, "");
          return keyBase === pitchBase;
        });

        if (pitchKey && instrumentData[pitchKey]) {
          const times: number[] = instrumentData[pitchKey];

          times.forEach((time: number) => {
            const index = Math.floor(time * 4);
            if (index < newData.length) {
              newData[index] = 1;
            }
          });
        }
      }
      console.log("newData", newData);
      return {
        ...instrument,
        data: newData,
      };
    });

    const allResults = [...generatedResults, ...newInstruments];

    return allResults;
  } catch (error) {
    toast.error("something went wrong", {
      duration: 1000,
    });
    return null;
  }
};
