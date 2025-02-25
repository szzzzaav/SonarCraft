export const Bottom = () => {
  return (
    <div className="relative w-full h-[100vh] bg-black text-white flex flex-col justify-between p-10">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-mono">
            SONARCRAFT LLC. ©2025
          </p>
          <p className="text-sm font-mono mt-2">
            SITE BY
            <br />
            CREATIVE STUDIO
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm font-mono"></p>
          <p className="text-sm font-mono mt-2">
            Everything
            <br />
            is music.
          </p>
        </div>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <h1 className="text-7xl font-bold tracking-tighter mb-4">
          JUST
        </h1>
        <h1 className="text-7xl font-bold tracking-tighter">
          ENJOY
        </h1>
      </div>

      <div className="flex justify-between items-end">
        <div>
          <p className="text-sm font-mono">
            REACH OUT
          </p>
          <p className="text-sm font-mono mt-2">
            HELLO@SONARCRAFT.COM
            <br />
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm font-mono">
            MAKE
          </p>
          <p className="text-sm font-mono mt-2">
            MUSIC
            <br />
            WITH US
          </p>
        </div>
      </div>
    </div>
  );
};
