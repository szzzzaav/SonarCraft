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
  const [isReplying, setIsReplying] = React.useState(false);
  const [replyText, setReplyText] = React.useState("");
  const [replyLoading, setReplyLoading] = React.useState(false);
  const [showReplies, setShowReplies] = React.useState(false);

  const isLiked = useQuery(api.comments.hasUserLikedComment, { commentId: comment._id });
  const likeComment = useMutation(api.comments.likeComment);
  const unlikeComment = useMutation(api.comments.unlikeComment);
  const addReply = useMutation(api.comments.replyToComment);

  // 获取回复列表
  const repliesQuery = showReplies
    ? { commentId: comment._id, paginationOpts: { numItems: 10 } }
    : "skip";

  const { results: replies } = usePaginatedQuery(api.comments.getRepliesByCommentId, repliesQuery, {
    initialNumItems: 10,
  });

  const handleLike = async () => {
    try {
      if (isLiked) {
        await unlikeComment({ commentId: comment._id });
        toast.success("Unlike successful");
      } else {
        await likeComment({ commentId: comment._id });
        toast.success("Like successful");
      }
    } catch (error) {
      toast.error("Operation failed", {
        description: "Please try again later",
      });
    }
  };

  const handleReply = async () => {
    if (!replyText.trim()) return;

    setReplyLoading(true);
    try {
      await addReply({
        commentId: comment._id,
        songId: comment.songId as any,
        reply: replyText,
      });
      setReplyText("");
      setShowReplies(true);
      toast.success("Reply sent");
    } catch (error) {
      toast.error("Reply failed", {
        description: "Please try again later",
      });
    } finally {
      setReplyLoading(false);
      setIsReplying(false);
    }
  };

  // 处理显示回复
  const toggleReplies = () => {
    setShowReplies(!showReplies);
    if (!showReplies && !isReplying) {
      setIsReplying(false);
    }
  };

  return (
    <div className="w-full py-3 border-b border-zinc-100 last:border-0">
      <div className="flex gap-3">
        <Avatar>
          <AvatarImage src={comment.ownerAvatar} />
          <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm">{comment.ownerName}</span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
            </span>
          </div>
          <p className="text-sm mb-2">{comment.comment}</p>

          <div className="flex items-center gap-4 mb-1">
            <button
              onClick={handleLike}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-red-500 transition-colors"
            >
              <HeartIcon className="w-4 h-4" fill={isLiked ? "red" : "none"} />
              <span>{comment.likesCount || 0}</span>
            </button>

            <button
              onClick={toggleReplies}
              className={`flex items-center gap-1 text-xs ${
                showReplies ? "text-blue-500" : "text-muted-foreground hover:text-blue-500"
              } transition-colors`}
            >
              <MessageCircle className="w-4 h-4" />
              <span>
                {comment.repliesCount || 0} {comment.repliesCount === 1 ? "reply" : "replies"}
              </span>
            </button>

            {!isReplying && (
              <button
                onClick={() => setIsReplying(true)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-blue-500 transition-colors"
              >
                Reply
              </button>
            )}
          </div>

          {/* 回复输入框 */}
          {isReplying && (
            <div className="flex gap-2 mt-2 mb-3 items-start">
              <Avatar className="w-7 h-7 mt-1">
                <AvatarFallback>
                  <User className="w-3 h-3" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Input
                  placeholder="Add a reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="text-sm h-9 mb-2"
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsReplying(false);
                      setReplyText("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleReply}
                    disabled={replyLoading || !replyText.trim()}
                  >
                    {replyLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Reply"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* 显示回复列表 */}
          {showReplies && replies && replies.length > 0 && (
            <div className="mt-2 space-y-3">
              {replies.map((reply) => (
                <div key={reply._id} className="flex gap-3">
                  <Avatar className="w-7 h-7">
                    <AvatarFallback>
                      <User className="w-3 h-3" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{reply.ownerName}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(reply.createdAt, { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm">{reply.reply}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-red-500 transition-colors">
                        <HeartIcon className="w-3 h-3" />
                        <span>{reply.likesCount || 0}</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsReplying(true);
                          setReplyText(`@${reply.ownerName} `);
                        }}
                        className="text-xs text-muted-foreground hover:text-blue-500 transition-colors"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Load more replies button */}
              {comment.repliesCount && comment.repliesCount > replies.length && (
                <Button variant="ghost" size="sm" className="ml-10 text-xs text-blue-500">
                  View more replies ({comment.repliesCount - replies.length})
                </Button>
              )}
            </div>
          )}

          {/* 没有回复时的提示但有回复按钮点击 */}
          {showReplies && (!replies || replies.length === 0) && (
            <div className="mt-2 text-xs text-muted-foreground">
              No replies yet. Be the first to reply!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
