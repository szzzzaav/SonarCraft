import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { Music } from "./music";
import { auth } from "@clerk/nextjs/server";
import { preloadQuery } from "convex/nextjs";
interface SongIdPageProps {
  params: Promise<{ musicId: Id<"songs"> }>;
}

const SongIdPage = async ({ params }: SongIdPageProps) => {
  const { musicId } = await params;
  const { getToken } = await auth();
  const token = (await getToken({ template: "convex" })) ?? undefined;

  if (!token) {
    throw new Error("Unauthorized");
  }

  const preloadedSong = await preloadQuery(
    api.songs.getById,
    {
      id: musicId,
    },
    { token }
  );
  return <Music preloadedSong={preloadedSong} />;
};

export default SongIdPage;
