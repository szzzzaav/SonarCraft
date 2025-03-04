import { useState } from "react";

interface RangeSliderProps {
  min?: number;
  max?: number;
  octaves: string[];
  selectedOctave: string;
  setSelectedOctave: (octave: string) => void;
}

const RangeSlider: React.FC<RangeSliderProps> = ({
  min = 0,
  max = 90,
  octaves,
  selectedOctave,
  setSelectedOctave,
}) => {
  const [value, setValue] = useState(0);
  const eachLength = 100 / (octaves?.length || 1);
  const percentage = ((value - min) / (max - min)) * 100;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setValue(newValue);
    const octaveIndex = Math.floor(newValue / eachLength);
    if (octaves && octaves[octaveIndex]) {
      setSelectedOctave(octaves[octaveIndex]);
    }
  };

  return (
    <div className="flex flex-col items-center w-full mx-auto">
      <div className="flex justify-between w-full mb-2">
        <div className="flex items-center justify-center px-3 w-full py-1">
          <span className="text-white select-none">{selectedOctave || `degree`}</span>
        </div>
      </div>
      <div className="relative w-full h-2">
        <div className="absolute w-full h-full bg-neutral-700 rounded-full" />

        <div
          className="absolute h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-orange-500 rounded-full"
          style={{
            width: `${percentage}%`,
          }}
        />

        <div
          className="absolute w-4 h-4 bg-white rounded-full shadow-lg -mt-1"
          style={{
            left: `calc(${percentage}% - 0.5rem)`,
          }}
        />

        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={handleChange}
          className="absolute w-full h-full opacity-0 cursor-pointer z-10"
          style={{
            appearance: "none",
            WebkitAppearance: "none",
          }}
        />
      </div>
    </div>
  );
};

export default RangeSlider;
