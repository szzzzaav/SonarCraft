import { Instrument } from "@/types/instruments";
import { getRandomHexColor } from "@/utils/getRandomColor";

export async function generateMusicData(
  instruments: Omit<Instrument, "color" | "instrumentId" | "data">[] | Instrument[],
  duration: number,
  fromIndex?: number,
  toIndex?: number
): Promise<Instrument[]> {
  const totalTimeSlices = Math.ceil(duration * 4);

  try {
    const response = await fetch("/api/generate-music", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        instruments,
        duration,
        fromIndex,
        toIndex,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const generatedInstruments = await response.json();
    return generatedInstruments;
  } catch (error) {
    console.error("Error generating music data:", error);

    return instruments.map((inst) => {
      const originalInst = inst as any;
      return {
        ...inst,
        color: originalInst.color || getRandomHexColor(),
        instrumentId: originalInst.instrumentId || Date.now().valueOf() + Math.random() * 1024,
        data: originalInst.data || Array(totalTimeSlices).fill(0),
      };
    }) as Instrument[];
  }
}
