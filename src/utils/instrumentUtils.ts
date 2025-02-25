import * as Tone from "tone";
import { Note, Octave, InstrumentRanges } from "@/types/instruments";

export const getAvailableNotes = (
  instrument: string,
  ranges: Record<string, InstrumentRanges>
): Note[] => {
  return Object.keys(ranges[instrument] || {});
};

export const getAvailableOctaves = (
  instrument: string,
  note: Note,
  ranges: Record<string, InstrumentRanges>
): Octave[] => {
  return ranges[instrument]?.[note] || [];
};

export const loadInstrumentSound = async (
  instrument: string,
  note: string,
  format: string = "mp3"
) => {
  try {
    await Tone.start();
    const sampler = new Tone.Sampler({
      urls: {
        C4: `${note}.${format}`,
      },
      baseUrl: `/sounds/${instrument}/`,
      onload: () => {
        return sampler;
      },
    }).toDestination();
  } catch (err) {
    console.error("音频播放失败:", err);
  }
};

export const playInstrumentSound = async (
  instrument: string,
  note: string,
  format: string = "mp3"
) => {
  try {
    await Tone.start();
    const sampler = new Tone.Sampler({
      urls: {
        C4: `${note}.${format}`,
      },
      baseUrl: `/sounds/${instrument}/`,
      onload: () => {
        sampler.triggerAttackRelease("C4", "1n");
        setTimeout(() => {
          sampler.dispose();
        }, 2000);
      },
    }).toDestination();
  } catch (err) {
    console.error("音频播放失败:", err);
  }
};
