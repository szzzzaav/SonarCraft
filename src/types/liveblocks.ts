import { Instrument } from "./instruments";

// 定义Presence类型
export type EditingTrack = {
  instrumentId: number | null;
  instrumentName: string;
};

export type MyPresence = {
  selectedId: number | null;
  editingTrack: EditingTrack;
};

// 扩展Liveblocks自己的Presence类型
declare module "@liveblocks/client" {
  interface Presence {
    selectedId: number | null;
    editingTrack: EditingTrack;
  }
}

declare module "@liveblocks/react" {
  interface Presence {
    selectedId: number | null;
    editingTrack: EditingTrack;
  }
}
