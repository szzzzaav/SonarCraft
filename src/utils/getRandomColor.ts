export function getRandomHexColor() {
  // 定义颜色范围
  const colors = [
    { r: 0x4f, g: 0x46, b: 0xe5 }, // indigo-600
    { r: 0x93, g: 0x33, b: 0xea }, // purple-600
    { r: 0xea, g: 0x58, b: 0x0c }, // orange-600
  ];

  // 随机选择两个相邻的颜色进行插值
  const randomIndex = Math.floor(
    Math.random() * (colors.length - 1)
  );
  const color1 = colors[randomIndex];
  const color2 =
    colors[randomIndex + 1];

  // 生成0-1之间的随机数作为插值比例
  const ratio = Math.random();

  // 在两个颜色之间进行线性插值
  const r = Math.round(
    color1.r +
      (color2.r - color1.r) * ratio
  );
  const g = Math.round(
    color1.g +
      (color2.g - color1.g) * ratio
  );
  const b = Math.round(
    color1.b +
      (color2.b - color1.b) * ratio
  );

  // 转换为十六进制格式
  const toHex = (n: number) =>
    n.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(
    g
  )}${toHex(b)}`;
}
