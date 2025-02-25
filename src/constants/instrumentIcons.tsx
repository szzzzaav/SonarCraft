import { JSX } from "react";
import { CgPiano } from "react-icons/cg";
import { GiGuitar, GiDrumKit, GiGuitarBassHead } from "react-icons/gi";

export const instrumentIcons: Record<string, JSX.Element> = {
  piano: <CgPiano />,
  guitar: <GiGuitar />,
  drums: <GiDrumKit />,
  bass: <GiGuitarBassHead />,
} as const;
