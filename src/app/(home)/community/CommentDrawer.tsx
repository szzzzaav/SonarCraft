"use client";

import * as React from "react";
import { Heart, HeartIcon, Loader2, MessageCircle, User, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Doc } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";
import { usePaginatedQuery, useQuery, useMutation } from "convex/react";
import { toast } from "sonner";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CommentDrawerProps {
  song: Doc<"songs">;
}

export function CommentDrawer({ song }: CommentDrawerProps) {
  const [loading, setLoading] = React.useState(false);
  const isLikedSong = useQuery(api.songs.hasUserLikedSong, { songId: song._id });
  const likeSong = useMutation(api.songs.likeSong);
  const unlikeSong = useMutation(api.songs.unlikeSong);
  const { results: comments, loadMore } = usePaginatedQuery(
    api.comments.getCommentsBySongId,
    {
      songId: song._id.toString(),
    },
    { initialNumItems: 10 }
  );

  useEffect(() => {
    if (comments && comments.length >= 0) {
      setLoading(false);
    }
  }, [comments]);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className="bg-zinc-800/50 flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all duration-300 shadow-sm">
          <Heart />
          <MessageCircle />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[90vh]">
        <DrawerTitle className="text-2xl font-bold text-zinc-600 px-6">{song.title}</DrawerTitle>
        <div className="w-full h-full p-6 flex items-center justify-start flex-col text-[#000]">
          <div className="w-full flex items-center justify-between p-3 h-8 ">
            <p className="text-[#000] font-bold text-2xl">Comments</p>
            <div className="flex items-center justify-center h-full gap-2">
              <Button
                variant="destructive"
                size="icon"
                onClick={async () => {
                  if (isLikedSong) {
                    try {
                      await unlikeSong({ songId: song._id });
                      toast.success("Song unliked");
                    } catch (error) {
                      toast.error("something went wrong", {
                        description: "Please try again later",
                      });
                    }
                  } else {
                    try {
                      await likeSong({ songId: song._id });
                      toast.success("Song liked");
                    } catch (error) {
                      toast.error("something went wrong", {
                        description: "Please try again later",
                      });
                    }
                  }
                }}
              >
                <HeartIcon fill={isLikedSong ? "red" : "white"} />
              </Button>
              <DrawerClose asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="bg-zinc-800/80 hover:bg-zinc-800 transition-all duration-300 shadow-sm"
                >
                  <X className="size-4 font-bold text-zinc-200" />
                </Button>
              </DrawerClose>
            </div>
          </div>
          <CommentInput song={song} />
          <div className="w-full h-full p-9 flex items-center justify-start flex-col text-[#000]">
            {loading && <Skeleton className="w-full h-[100px] rounded-md" />}
            {!loading &&
              comments?.map((comment) => <Comment comment={comment} key={comment._id} />)}
            {!loading && comments.length === 0 && (
              <p className="text-zinc-600 text-2xl font-bold">No comments yet</p>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

const CommentInput = ({ song }: { song: Doc<"songs"> }) => {
  const [comment, setComment] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const addComment = useMutation(api.comments.createComment);
  return (
    <div className="w-full p-10 text-2xl flex items-center justify-center flex-col gap-2">
      <Input
        type="text"
        placeholder="Comment"
        className="h-16 shadow-sm"
        value={comment}
        onChange={(v) => {
          setComment(v.target.value);
        }}
      />
      <div className="flex items-center justify-end gap-2 w-full">
        <Button variant="destructive" className="shadow-sm" onClick={() => setComment("")}>
          Clear
        </Button>
        <Button
          className="bg-zinc-800 hover:bg-zinc-800/95 transition-all duration-300 shadow-sm"
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            try {
              await addComment({ songId: song._id, comment });
            } catch (error) {
              toast.error("something went wrong", {
                description: "Please try again later",
              });
            } finally {
              setLoading(false);
              setComment("");
            }
          }}
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : "Comment"}
        </Button>
      </div>
      <div className="w-full bg-zinc-500/50 h-[1px]" />
    </div>
  );
};

const Comment = ({ comment }: { comment: Doc<"comments"> }) => {
  return (
    <div className="w-full p-4">
      <div className="flex gap-4">
        <Avatar>
          <AvatarImage src={comment.ownerAvatar} />
          <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-medium text-sm pb-0.5">{comment.ownerName}</span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
            </span>
          </div>
          <p className="text-sm">{comment.comment}</p>
        </div>
      </div>
    </div>
  );
};
