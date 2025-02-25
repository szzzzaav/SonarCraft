export type Note = string;
export type Octave = string;

export interface InstrumentConfig {
  notes: Note[];
  octaves: Octave[];
}

export interface InstrumentRanges {
  [note: string]: Octave[];
}

export type InstrumentName = "piano" | "guitar" | "bass" | "drums";

export type Instrument = {
  name: string;
  color: string;
  data: number[];
  instrument: string;
  pitch: string;
  instrumentId: number;
};
