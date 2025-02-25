import { Instrument } from "@/types/instruments";
import HeaderRow from "./HeaderRow";
import Row from "./Row";

interface TrackContainerProps {
  children?: React.ReactNode;
  col: number;
  instruments: Instrument[];
  setDataItem: (instrumentIndex: number, dataIndex: number) => void;
  currentBeat: number;
  setCurrentBeat?: (beat: number) => void;
  isPlaying?: boolean;
  setIsPlaying?: (playing: boolean) => void;
  startBeat?: number;
  setStartBeat?: (beat: number) => void;
}

export const TrackContainer: React.FC<TrackContainerProps> = ({
  children,
  col,
  instruments,
  setDataItem,
  currentBeat,
  setCurrentBeat,
  isPlaying,
  setIsPlaying,
  startBeat,
  setStartBeat,
}) => {
  return (
    <div className="w-full flex flex-col h-full relative z-10">
      <div className="min-w-fit">
        <div className="sticky top-0 z-10">
          <HeaderRow
            count={col}
            timeline={true}
            currentBeat={currentBeat}
            setCurrentBeat={setCurrentBeat}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            startBeat={startBeat}
            setStartBeat={setStartBeat}
          />
        </div>
        {instruments.map((item, index) => (
          <Row
            key={index}
            count={col}
            data={item}
            instrumentIndex={index}
            setDataItem={setDataItem}
            currentBeat={currentBeat}
          />
        ))}
        {children}
      </div>
    </div>
  );
};
