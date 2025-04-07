import Image from "next/image";
import { Doc } from "../../../../convex/_generated/dataModel";
import { FaPlay } from "react-icons/fa6";
import { DrowdownMenu } from "./DrowdownMenu";
import { CommentDrawer } from "./CommentDrawer";

interface SongCardProps {
  Song: Doc<"songs">;
  delay?: Number;
  user?: boolean;
}

export const SongCard = ({ Song, delay, user = false }: SongCardProps) => {
  const onNewTabClick = (id: string) => {
    window.open(`/musics/${id}`, "_blank");
  };

  if (Song === undefined) {
    return <div className="w-full h-full"></div>;
  }
  return (
    <div className="w-[360px] min-h-[90vh] py-1">
      <div className="w-full h-full">
        <div className="relative w-full h-full">
          <div className="w-full h-[500px] rounded-[0.8em] p-[1em] bg-zinc-900 text-zinc-200 font-semibold">
            <p>{Song.title}</p>
            <Image
              priority
              src={Song.imgPath || "/images/create/5.png"}
              width={500}
              height={500}
              className="rounded-[0.8em]"
              alt=""
            />
            <div className="flex justify-between items-center p-6">
              <button className="transition rounded-full flex items-center bg-indigo-600 p-4 drop-shadow-sm tarnslate translte-y-1/4 group-hover:opacity-100 group-hover:translate-y-0 hover:scale-110 w-35 h-35">
                <FaPlay className="text-black" />
              </button>
              {user && (
                <DrowdownMenu
                  SongId={Song._id}
                  title={Song.title}
                  onNewTabClick={onNewTabClick}
                  released={Song.released || false}
                />
              )}
              {!user && (
                <div className="p-3 text-[#fff] font-medium text-xs bg-slate-800 hover:bg-slate-700 transition-all rounded-sm uppercase cursor-pointer">
                  Start With This
                </div>
              )}
            </div>
            <div className="flex justify-start items-center relative">
              <CommentDrawer song={Song} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
