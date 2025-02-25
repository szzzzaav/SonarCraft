interface ImgProps {
  src: string;
  alt?: string;
  className?: string;
}

export default function Img({
  src,
  alt,
  className,
}: ImgProps) {
  return (
    <img
      className={`w-full h-full object-cover rounded-2xl ${className}`}
      src={src}
      alt={alt}
    />
  );
}
