import { twMerge } from "tailwind-merge";

interface HeaderRowProps {
  count: number;
  timeline: boolean;
  currentBeat?: number;
  setCurrentBeat?: (beat: number) => void;
  startBeat?: number;
  setStartBeat?: (beat: number) => void;
  isPlaying?: boolean;
  setIsPlaying?: (playing: boolean) => void;
}

const HeaderRow: React.FC<HeaderRowProps> = ({
  count,
  timeline,
  currentBeat,
  setCurrentBeat,
  startBeat,
  setStartBeat,
  isPlaying,
  setIsPlaying,
}) => {
  let timeIdx = 0;
  return (
    <div
      className={twMerge(
        "w-auto h-[36px] flex flex-row rounded justify-start items-start box-border",
        timeline ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-orange-600" : "bg-[#1e1e1e]"
      )}
    >
      {Array(count)
        .fill(null)
        .map((_, index) => {
          timeIdx += 1;
          timeIdx = Number(timeIdx.toFixed(1));
          if (Math.abs((timeIdx % 1) - 0.4) < 0.0001) {
            timeIdx = Math.floor(timeIdx) + 1;
          }
          return (
            <div
              key={timeIdx}
              className={twMerge(
                "flex flex-row box-border border-r-[1px] border-neutral-700 cursor-pointer hover:bg-opacity-10 hover:cursor-pointer",
                "w-[140px] h-full",
                currentBeat && Math.floor(currentBeat / 4) === index
                  ? "bg-opacity-20 bg-indigo-500"
                  : "",
                startBeat && Math.floor(startBeat / 4) === index
                  ? "bg-opacity-20 bg-indigo-700"
                  : ""
              )}
              onClick={() => {
                if (setStartBeat && setCurrentBeat) {
                  setStartBeat(index * 4);
                  setCurrentBeat(index * 4);
                  if (isPlaying && setIsPlaying) {
                    setIsPlaying(false);
                  }
                }
              }}
            >
              <div className="w-[140px] h-[35px] box-border text-xs text-neutral-200 font-semibold flex items-center pl-2">
                {timeIdx.toFixed(1)}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default HeaderRow;
