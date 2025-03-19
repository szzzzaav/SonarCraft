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
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <p className="text-white text-[100px] font-bold">
            <span className="text-indigo-500">C</span>ODE WITH MUSI
            <span className="text-rose-500">C</span>
          </p>
        </div>
        <div className="w-full h-auto flex items-center justify-center absolute bottom-5 z-10">
          <div className="w-[500px] h-[100px] flex items-center justify-center gap-0 relative">
            <div className="w-[100px] h-[100px]">
              <Image
                src="/images/landing/S.png"
                alt=""
                width={100}
                height={100}
                className="object-cover"
              />
            </div>
            <div className="w-[100px] h-[100px]">
              <Image
                src="/images/landing/O.png"
                alt=""
                width={100}
                height={100}
                className="object-cover"
              />
            </div>
            <div className="w-[100px] h-[100px]">
              <Image
                src="/images/landing/N.png"
                alt=""
                width={100}
                height={100}
                className="object-cover"
              />
            </div>
            <div className="w-[100px] h-[100px]">
              <Image
                src="/images/landing/A.png"
                alt=""
                width={100}
                height={100}
                className="object-cover"
              />
            </div>
            <div className="w-[100px] h-[100px]">
              <Image
                src="/images/landing/R.png"
                alt=""
                width={100}
                height={100}
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
