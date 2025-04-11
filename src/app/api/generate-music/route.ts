import OpenAI from "openai";
import { NextResponse } from "next/server";
import { Instrument } from "@/types/instruments";
import { getRandomHexColor } from "@/utils/getRandomColor";

const apiKey = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY;

let openai: OpenAI | null = null;
if (apiKey) {
  openai = new OpenAI({
    baseURL: "https://api.deepseek.com",
    apiKey,
    dangerouslyAllowBrowser: true,
  });
}

function generateMockMusicData(instruments: any[], duration: number) {
  const totalTimeSlices = Math.ceil(duration * 4);
  const result: Record<string, number[]> = {};

  instruments.forEach((inst) => {
    const data = Array(totalTimeSlices).fill(0);

    if (inst.instrument === "piano") {
      for (let i = 0; i < totalTimeSlices; i += 4) {
        data[i] = 1;
      }
    } else if (inst.instrument === "drums") {
      for (let i = 0; i < totalTimeSlices; i += 2) {
        data[i] = 1;
      }
    } else if (inst.instrument === "bass") {
      for (let i = 0; i < totalTimeSlices; i += 4) {
        data[i] = 1;
      }
    } else if (inst.instrument === "guitar") {
      for (let i = 0; i < totalTimeSlices; i += 8) {
        if (i + 2 < totalTimeSlices) data[i + 2] = 1;
        if (i + 5 < totalTimeSlices) data[i + 5] = 1;
        if (i + 7 < totalTimeSlices) data[i + 7] = 1;
      }
    } else {
      for (let i = 0; i < totalTimeSlices; i += 3) {
        data[i] = 1;
      }
    }

    result[inst.name] = data;
  });

  return result;
}

// 合并原有数据和新生成的数据
function mergeData(
  originalData: number[],
  fromIndex: number,
  toIndex: number,
  newData: number[],
  duration: number
): number[] {
  // 步骤1: 保留原始数据的前部分 (0 到 fromIndex-1)
  const frontPart = originalData.slice(0, fromIndex);

  // 步骤2: 处理参考范围内的数据 (fromIndex 到 toIndex-1)
  const referenceSlice = originalData.slice(fromIndex, toIndex);

  // 步骤3: 合并参考范围内的数据，保留原始数据中的"1"，其他位置使用新数据
  const combinedReferenceData = referenceSlice.map((value, index) => {
    // 如果原始数据是1，保留1
    if (value === 1) return 1;
    // 否则，如果新数据有对应位置，使用新数据
    if (index < newData.length) return newData[index];
    // 如果新数据不够长，保持原始值
    return value;
  });

  // 步骤4: 准备额外的新生成数据
  const additionalTimeSlices = Math.ceil(duration * 4);
  const additionalData = newData.slice(0, additionalTimeSlices);

  // 步骤5: 保留原始数据的尾部分 (toIndex 到末尾)，完整保留，无论是0还是1
  const tailPart = originalData.slice(toIndex);

  // 步骤6: 构建最终结果：前部分 + 合并后的参考范围 + 额外数据 + 尾部分
  // 修改：将尾部分添加到额外数据之后，确保它们都出现在结果中
  const finalResult = [
    ...frontPart, // 原始数据前部分
    ...combinedReferenceData, // 合并后的参考范围
    ...additionalData, // 新生成的额外数据
    ...tailPart, // 原始数据尾部分，添加到额外数据之后
  ];

  return finalResult;
}

export async function POST(request: Request) {
  try {
    const { instruments, duration, fromIndex, toIndex } = await request.json();

    if (!instruments || !Array.isArray(instruments) || !duration) {
      return NextResponse.json({ error: "Invalid request parameters" }, { status: 400 });
    }

    const fromIndexInArray = Math.floor(fromIndex * 4);
    const toIndexInArray = Math.ceil(toIndex * 4);

    // 计算生成数据所需的总时间片
    const totalTimeSlices = Math.ceil(duration * 4);

    let generatedData: Record<string, number[]>;

    if (openai) {
      try {
        // 使用中文提示词
        const prompt = `我需要你为以下乐器生成音乐数据：
${instruments.map((inst) => `- ${inst.name}（乐器类型：${inst.instrument}，音高：${inst.pitch}）`).join("\n")}

每个乐器的数据应该是一个长度为${totalTimeSlices}的数组，代表${duration}秒的音乐（每个元素表示0.25秒）。
数组中的每个元素应该是0或1：
- 0表示此时间点不弹奏音符
- 1表示此时间点弹奏音符

请为每个乐器生成合理的节奏模式，考虑到不同乐器之间的和谐配合。
生成的数据将会与原有的数据合并，所以请确保生成的内容能够自然地延续原有的音乐模式。
返回格式应该是一个JSON对象，键是乐器名称，值是对应的数据数组。`;

        const completion = await openai.chat.completions.create({
          messages: [
            {
              role: "system",
              content:
                "你是一个专业的音乐生成助手，擅长创作音乐节奏和旋律模式。请根据用户的乐器配置生成合适的音乐数据，确保生成的内容能与现有音乐自然衔接。",
            },
            { role: "user", content: prompt },
          ],
          model: "deepseek-chat",
          response_format: { type: "json_object" },
        });

        const response = completion.choices[0]?.message.content;
        if (!response) {
          throw new Error("Failed to get API response");
        }

        generatedData = JSON.parse(response);
      } catch (apiError) {
        console.error("API error, falling back to mock data:", apiError);
        generatedData = generateMockMusicData(instruments, duration);
      }
    } else {
      console.warn("No API key available, using mock data");
      generatedData = generateMockMusicData(instruments, duration);
    }

    const result = instruments.map((inst) => {
      const originalInstrument = inst as Instrument;
      const instrumentId =
        originalInstrument.instrumentId || Date.now().valueOf() + Math.random() * 1024;
      const color = originalInstrument.color || getRandomHexColor();

      // 确保生成数据长度正确
      let newData = generatedData[inst.name] || Array(totalTimeSlices).fill(0);
      if (newData.length < totalTimeSlices) {
        newData = [...newData, ...Array(totalTimeSlices - newData.length).fill(0)];
      } else if (newData.length > totalTimeSlices) {
        newData = newData.slice(0, totalTimeSlices);
      }

      if (
        typeof fromIndex === "number" &&
        typeof toIndex === "number" &&
        fromIndex >= 0 &&
        toIndex > fromIndex &&
        originalInstrument.data &&
        Array.isArray(originalInstrument.data)
      ) {
        // 合并原有数据和新生成的数据
        const mergedData = mergeData(
          originalInstrument.data,
          fromIndexInArray,
          toIndexInArray,
          newData,
          duration
        );

        return {
          ...originalInstrument,
          color,
          instrumentId,
          data: mergedData,
        };
      }

      return {
        ...originalInstrument,
        color,
        instrumentId,
        data: newData,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error generating music data:", error);
    return NextResponse.json({ error: "Error processing request" }, { status: 500 });
  }
}
