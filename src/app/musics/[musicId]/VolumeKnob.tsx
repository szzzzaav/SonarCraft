import { useState, useRef } from "react";

interface VolumeKnobProps {
  note: string;
  notes: string[];
  setNote: (note: any) => void;
}

const VolumeKnob: React.FC<VolumeKnobProps> = ({ note, notes, setNote }) => {
  const eachLength = 270 / notes.length;
  const [isRotating, setIsRotating] = useState(false);
  const knobRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);
  const rotateKnob = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isRotating) {
      const knobRect = knobRef.current!.getBoundingClientRect();
      const knobX = knobRect.left + knobRef.current!.clientWidth / 2;
      const knobY = knobRect.top + knobRef.current!.clientHeight / 2;

      let deltaX = e.clientX - knobX;
      let deltaY = e.clientY - knobY;
      let angleRad = Math.atan2(deltaY, deltaX);
      let angleDeg = angleRad * (180 / Math.PI);

      let rotateAngle = (angleDeg - 135 + 360) % 360;

      if (rotateAngle <= 270) {
        pointerRef.current!.style.transform = `rotate(${rotateAngle - 45}deg)`;

        let progressPercent = rotateAngle / 270;
        circleRef.current!.style.strokeDashoffset = `${880 - 660 * progressPercent}`;
        let noteIndex = Math.floor(rotateAngle / eachLength);
        if (noteIndex >= 0 && noteIndex < notes.length) {
          setNote(notes[noteIndex]);
        }
      }
    }
  };
  return (
    <div
      className="center w-full h-full flex items-center justify-center cursor-pointer"
      onMouseDown={() => {
        setIsRotating(true);
      }}
      onMouseUp={() => {
        setIsRotating(false);
      }}
      onMouseMove={(e) => {
        rotateKnob(e);
      }}
    >
      <div className="slider w-[300px] h-[300px] flex items-center justify-center relative">
        <div
          className="w-[220px] h-[220px] bg-neutral-900/50 rounded-full absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] flex items-center justify-center"
          ref={knobRef}
        >
          <div className="rotator w-[180px] h-[180px] bg-neutral-950 rounded-full flex items-center  shadow-md shadow-black relative z-[1]">
            <div className="select-none w-[40px] h-[40px] mx-0 my-[15px] text-sm text-neutral-200 flex items-start justify-center">
              {note}
            </div>
          </div>
          <div
            className="absolute w-[120px] h-[20px] left-0 flex items-center justify-start"
            ref={pointerRef}
            style={{
              top: "calc(50% - 10px)",
              transformOrigin: "110px 10px",
              transform: "rotate(-45deg)",
            }}
          >
            <span className="material-icons">
              <div className="w-[15px] h-[3px] bg-neutral-200 rounded-sm shadow-2xl shadow-black"></div>
            </span>
          </div>
        </div>

        <svg width={300} height={300}>
          <circle
            cx={150}
            cy={150}
            r={140}
            fill="none"
            className="stroke-neutral-800 VolumeKnob-Circle"
          />
          <circle
            className="VolumeKnob-Circle"
            cx={150}
            cy={150}
            r={140}
            fill="none"
            style={{
              stroke: "url(#gradient)",
              strokeWidth: "16px",
              strokeLinecap: "round",
              strokeDasharray: "880",
              strokeDashoffset: "880",
            }}
            ref={circleRef}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ea580c"></stop>
              <stop offset="50%" stopColor="#9333ea"></stop>
              <stop offset="100%" stopColor="#4f46e5"></stop>
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export default VolumeKnob;
