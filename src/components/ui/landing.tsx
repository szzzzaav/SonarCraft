import Img from "@/app/(home)/img";
import Image from "next/image";

export const Landing = () => {
  return (
    <section
      className="relative w-screen h-full flex items-center justify-center overflow-hidden"
      style={{
        padding: "1em 1em 1em 1em",
      }}
    >
      <div className="w-full h-full rounded-2xl relative">
        <Img src="/images/landing/landing.png" alt="" className="rounded-2xl overflow-hidden" />
        <div className="backdrop-blur-0 absolute top-0 left-0 w-full h-full bg-black/50"></div>

        <div className="w-full h-auto flex items-center justify-center absolute bottom-20 z-10">
          <div className="w-[1000px] h-[200px] flex items-center justify-center gap-0 relative">
            <div className="w-[200px] h-[200px]">
              <Image
                src="/images/landing/S.png"
                alt=""
                width={200}
                height={200}
                className="object-cover"
              />
            </div>
            <div className="w-[200px] h-[200px]">
              <Image
                src="/images/landing/O.png"
                alt=""
                width={200}
                height={200}
                className="object-cover"
              />
            </div>
            <div className="w-[200px] h-[200px]">
              <Image
                src="/images/landing/N.png"
                alt=""
                width={200}
                height={200}
                className="object-cover"
              />
            </div>
            <div className="w-[200px] h-[200px]">
              <Image
                src="/images/landing/A.png"
                alt=""
                width={200}
                height={200}
                className="object-cover"
              />
            </div>
            <div className="w-[200px] h-[200px]">
              <Image
                src="/images/landing/R.png"
                alt=""
                width={200}
                height={200}
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
