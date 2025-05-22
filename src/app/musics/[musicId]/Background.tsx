"use client";

import { useEffect, useRef, memo } from "react";

const Background: React.FC = memo(() => {
  const interactiveRef = useRef<HTMLDivElement>(null);
  const curX = useRef(0);
  const curY = useRef(0);
  const tgX = useRef(0);
  const tgY = useRef(0);
  const rafId = useRef<number | null>(null);

  // 优化动画函数
  const move = () => {
    // 如果距离很小，不进行更新，减少重绘
    const diffX = tgX.current - curX.current;
    const diffY = tgY.current - curY.current;

    if (Math.abs(diffX) > 0.1 || Math.abs(diffY) > 0.1) {
      curX.current += diffX * 0.2;
      curY.current += diffY * 0.2;

      if (interactiveRef.current) {
        // 使用transform的translateX和translateY，触发GPU加速
        interactiveRef.current.style.transform = `translate3d(${Math.round(
          curX.current
        )}px, ${Math.round(curY.current)}px, 0)`;
      }
    }

    rafId.current = requestAnimationFrame(move);
  };

  useEffect(() => {
    // 使用节流函数减少mousemove事件的处理频率
    let lastTime = 0;
    const throttleTime = 16; // 约60fps

    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastTime < throttleTime) return;

      lastTime = now;
      tgX.current = e.clientX;
      tgY.current = e.clientY;
    };

    // 使用passive: true提高事件监听性能
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    rafId.current = requestAnimationFrame(move);

    // 清理函数
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  return (
    <>
      <div className="gradient-bg fixed left-0 top-0 overflow-hidden h-[100vh] w-[100vw] bg-black -z-50 will-change-transform">
        <svg xmlns="http://www.w3.org/2000/svg" width="0" height="0">
          <defs>
            <filter id="goo">
              <feGaussianBlur in="SourceGraphic" stdDeviation="20" result="blur"></feGaussianBlur>
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -9"
                result="goo"
              ></feColorMatrix>
              <feBlend in="SourceGraphic" in2="goo" mode="soft-light"></feBlend>
            </filter>
          </defs>
        </svg>
        <div
          className="gradient-container w-full h-full"
          style={{
            filter: "url(#goo) blur(40px) contrast(40%)",
            willChange: "transform",
          }}
        >
          {/* 将多个渐变层合并为更少的元素，减少DOM节点 */}
          <div
            className="g1 absolute w-[80%] h-[80%] opacity-100 mix-blend-hard-light origin-center animate-[moveVertical_30s_ease_infinite] will-change-transform"
            style={{
              background:
                "radial-gradient(circle at center,rgb(18, 113 ,255,0.8) 0, rgb(18, 113 ,255,0) 50%) no-repeat",
              top: "calc(50% - 80% / 2)",
              left: "calc(50% - 80% / 2)",
              backfaceVisibility: "hidden",
            }}
          ></div>
          <div
            className="g2 absolute w-[80%] h-[80%] opacity-100 mix-blend-hard-light animate-[moveInCircle_20s_reverse_infinite] will-change-transform"
            style={{
              background:
                "radial-gradient(circle at center,rgb(221,74,255,0.8) 0, rgb(221,74,255,0) 50%) no-repeat",
              top: "calc(50% - 80% / 2)",
              left: "calc(50% - 80% / 2)",
              transformOrigin: "calc(50% - 400px)",
              backfaceVisibility: "hidden",
            }}
          ></div>
          <div
            className="g3 absolute w-[80%] h-[80%] opacity-100 mix-blend-hard-light animate-[moveInCircle_40s_linear_infinite] will-change-transform"
            style={{
              background:
                "radial-gradient(circle at center,rgb(100,220,255,0.8) 0, rgb(100,220,255,0) 50%) no-repeat",
              top: "calc(50% - 80% / 2 + 200px)",
              left: "calc(50% - 80% / 2 - 500px)",
              transformOrigin: "calc(50% + 400px)",
              backfaceVisibility: "hidden",
            }}
          ></div>

          {/* 合并部分渐变层 */}
          <div
            className="interactive absolute w-[80%] h-[80%] -left-1/2 -top-1/2 opacity-70 mix-blend-hard-light will-change-transform"
            ref={interactiveRef}
            style={{
              background:
                "radial-gradient(circle at center,rgb(140,100,255,0.8) 0, rgb(140,100,255,0) 50%) no-repeat",
              backfaceVisibility: "hidden",
              transform: "translate3d(0, 0, 0)",
            }}
          ></div>
        </div>
      </div>
    </>
  );
});

Background.displayName = "Background";

export default Background;
