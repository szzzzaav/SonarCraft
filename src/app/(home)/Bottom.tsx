import { Button } from "@/components/ui/button";

export const Bottom = () => {
  // 创建文本层，bottom值变化量逐渐减小
  const textLayers = Array.from({ length: 12 }).map((_, index) => {
    // 使用非线性函数计算bottom值，让间距逐渐减小
    // 使用指数递减函数：初始间距大，后续逐渐减小
    const bottomValue = Math.round(200 * (1 - Math.exp(-0.15 * index)));

    return {
      id: index,
      bottom: bottomValue,
      zIndex: 30 - index, // z-index逐渐减小
    };
  });

  return (
    <div className="relative w-screen h-screen bg-black text-white z-10">
      <Button
        variant="outline"
        className="absolute top-[200px] left-10 border border-white text-white hover:bg-white hover:text-black transition-colors duration-300 z-50"
        onClick={() => {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }}
      >
        Back to Top
      </Button>

      <div className="absolute top-[200px] right-10">
        <ul className="space-y-4 text-right">
          <li>
            <a href="https://bilibili.com" className="hover:opacity-70">
              bilibili
            </a>
          </li>
          <li>
            <a href="https://github.com" className="hover:opacity-70">
              Github
            </a>
          </li>
          <li>
            <a href="mailto:hello@sonar.com" className="hover:opacity-70">
              hello@sonar.com
            </a>
          </li>
        </ul>
      </div>

      {textLayers.map((layer) => (
        <h1
          key={layer.id}
          className="absolute text-[200px] leading-[160px] font-bold tracking-tight whitespace-nowrap w-auto left-0 bg-black text-center"
          style={{
            letterSpacing: "5px",
            bottom: `${layer.bottom}px`,
            zIndex: layer.zIndex,
          }}
        >
          LET'S WORK
        </h1>
      ))}
    </div>
  );
};
