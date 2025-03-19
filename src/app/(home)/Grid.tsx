"use client";
import { useEffect, useRef, CSSProperties } from "react";

const GridBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const gridStyle: CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: `
      linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
      radial-gradient(circle at center, #0a0a0a, #000000)
    `,
    backgroundSize: "40px 40px, 40px 40px, 100% 100%",
    zIndex: 0,
  };

  useEffect(() => {
    const style = document.createElement("style");

    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return <div ref={containerRef} style={gridStyle}></div>;
};

export default GridBackground;
