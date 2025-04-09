"use client";

import { SiMusicbrainz } from "react-icons/si";
import { FaItunes } from "react-icons/fa";
import { Authenticated, AuthLoading, useMutation } from "convex/react";
import { UserButton } from "@clerk/nextjs";
import { neobrutalism } from "@clerk/themes";
import { Button } from "@/components/ui/button";
import { Loader2, LoaderIcon } from "lucide-react";
import { useOthers, useStorage } from "@liveblocks/react";
import { useState } from "react";
import { Composer } from "@liveblocks/react-ui";
import { Avatars } from "./Avatars";
import { Inbox } from "./Inbox";
import { Doc } from "../../../../convex/_generated/dataModel";
import { SongInput } from "./SongInput";
import { api } from "../../../../convex/_generated/api";
import { toast } from "sonner";
import { AIEditModel } from "./AIEditModel";
interface HeaderProps {
  data: Doc<"songs"> | null;
}

const Header: React.FC<HeaderProps> = ({ data }) => {
  const others = useOthers();
  const userCount = others.length;
  const mutate = useMutation(api.songs.updateDatabyId);
  const [open, setIsOpen] = useState(false);
  const [pending, setIsPending] = useState(false);
  const [openAIModal, setOpenAIModal] = useState(false);
  const instruments = useStorage((root) => root.instruments);
  const timeline = useStorage((root) => root.timeline);
  const handleSaveClick = () => {
    if (!data) {
      toast.error("project not found");
      return;
    }
    setIsPending(true);
    if (!instruments || !timeline) {
      toast.error("Storage error,Please try again");
      return;
    }
    mutate({ id: data._id, instruments, timeline })
      .then(() => toast.success("updated"))
      .catch(() => {
        toast.error("something went wrong!!!");
      })
      .finally(() => {
        setIsPending(false);
      });
  };
  return (
    <div className="flex flex-row  gap-x-2 h-[20%] w-full">
      {open && (
        <Composer className="fixed w-[60vw] bottom-11 left-[50%] translate-x-[-50%] z-50 rounded-md bg-[#000]" />
      )}
      <div className="bg-neutral-900 rounded-lg h-full w-[20%]">
        <div className="flex flex-col gap-4 px-5 py-7 w-full">
          <div className="flex flex-row h-auto items-center w-full gap-x-4 text-md font-medium cursor-pointer hover:text-white transition text-neutral-200 py-1">
            <SiMusicbrainz />
            <div>SonarCraft-BeatMaker</div>
          </div>
          <div className="flex flex-row h-auto items-center w-full gap-x-4 text-md font-medium cursor-pointer hover:text-white transition text-neutral-400 py-1">
            <FaItunes />
            <div onClick={() => setOpenAIModal(true)}>compose with AI</div>
          </div>
        </div>
      </div>

      <div className="h-full bg-gradient-to-b from-indigo-600 via-purple-600  to-orange-600 p-6 w-full rounded-lg flex flex-col items-center justify-between">
        <div className="w-full flex items-center justify-between">
          <SongInput title={data?.title || ""} id={data?._id} />
          <div className="flex items-center gap-5">
            <Button
              variant={"secondary"}
              className="hover:bg-slate-50"
              onClick={() => setIsOpen(!open)}
            >
              {open ? "Close" : "Add Comment"}
            </Button>
            <Button disabled={pending} onClick={handleSaveClick}>
              {pending ? <LoaderIcon className="size-4 animate-spin" /> : "Save"}
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between w-full">
          <h1 className="text-zinc-100 text-3xl font-semibold">Welcome Back</h1>
          <AuthLoading>
            <Button disabled>
              <Loader2 className="animate-spin" />
              Please wait
            </Button>
          </AuthLoading>
          <Authenticated>
            <div className="flex gap-3 items-center">
              <Avatars />
              <Inbox />
              <UserButton
                appearance={{
                  baseTheme: neobrutalism,
                }}
              />
            </div>
          </Authenticated>
          <div>There are {userCount} other user(s) online</div>
        </div>
      </div>
      {openAIModal && <AIEditModel open={openAIModal} setOpen={setOpenAIModal} />}
    </div>
  );
};

export default Header;
