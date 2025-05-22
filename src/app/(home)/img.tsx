interface ImgProps {
  src: string;
  alt?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  width?: number;
  height?: number;
}

export default function Img({
  src,
  alt = "图片",
  className,
  sizes = "100vw",
  priority = false,
  width,
  height,
}: ImgProps) {
  // 根据文件扩展名确定是否是静态图片
  const isStaticImage = src.startsWith("/") || src.startsWith("http");

  // 如果不是优先加载的图片，就使用懒加载
  const loadingProp = priority ? undefined : "lazy";

  return (
    <img
      className={`w-full h-full object-cover rounded-2xl ${className}`}
      src={src}
      alt={alt}
      loading={loadingProp}
      decoding="async"
      width={width}
      height={height}
      sizes={sizes}
      // 如果是静态图片，添加srcSet属性
      {...(isStaticImage && {
        srcSet: `${src}?w=640 640w, ${src}?w=1080 1080w, ${src}?w=1920 1920w`,
      })}
    />
  );
}
