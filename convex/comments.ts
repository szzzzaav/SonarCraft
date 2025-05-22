import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";

export const getCommentsBySongId = query({
  args: {
    songId: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { songId, paginationOpts }) => {
    return await ctx.db
      .query("comments")
      .withIndex("by_song", (q) => q.eq("songId", songId))
      .order("desc")
      .paginate(paginationOpts);
  },
});

export const createComment = mutation({
  args: {
    songId: v.id("songs"),
    comment: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new ConvexError("Unauthorized");
    }

    const song = await ctx.db.get(args.songId);
    if (!song) {
      throw new ConvexError("Song not found");
    }

    return await ctx.db.insert("comments", {
      songId: args.songId,
      comment: args.comment,
      ownerAvatar: user.pictureUrl ? String(user.pictureUrl) : "/images/cover.webp",
      ownerId: user.subject,
      ownerName: user.name ?? user.email ?? user.subject ?? "Anonymous User",
      createdAt: Date.now(),
      likesCount: 0,
      repliesCount: 0,
    });
  },
});

export const getCommentLikes = query({
  args: { commentId: v.id("comments") },
  handler: async (ctx, { commentId }) => {
    const comment = await ctx.db.get(commentId);
    if (!comment) {
      throw new ConvexError("Comment not found");
    }

    return await ctx.db
      .query("commentLikes")
      .withIndex("by_comment", (q) => q.eq("commentId", commentId))
      .collect();
  },
});

export const hasUserLikedComment = query({
  args: { commentId: v.id("comments") },
  handler: async (ctx, { commentId }) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new ConvexError("Unauthorized");
    }

    const like = await ctx.db
      .query("commentLikes")
      .withIndex("by_comment_owner", (q) =>
        q.eq("commentId", commentId).eq("ownerId", user.subject)
      )
      .first();

    return !!like;
  },
});

export const likeComment = mutation({
  args: { commentId: v.id("comments") },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new ConvexError("Unauthorized");
    }

    const comment = await ctx.db.get(args.commentId);
    if (!comment) {
      throw new ConvexError("Comment not found");
    }

    const existingLike = await ctx.db
      .query("commentLikes")
      .withIndex("by_comment_owner", (q) =>
        q.eq("commentId", args.commentId).eq("ownerId", user.subject)
      )
      .first();

    if (existingLike) {
      throw new ConvexError("Already liked");
    }

    await ctx.db.insert("commentLikes", {
      commentId: args.commentId,
      ownerId: user.subject,
      createdAt: Date.now(),
    });

    const currentLikes = comment.likesCount || 0;
    return await ctx.db.patch(args.commentId, {
      likesCount: currentLikes + 1,
    });
  },
});

export const unlikeComment = mutation({
  args: { commentId: v.id("comments") },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new ConvexError("Unauthorized");
    }

    const comment = await ctx.db.get(args.commentId);
    if (!comment) {
      throw new ConvexError("Comment not found");
    }

    const existingLike = await ctx.db
      .query("commentLikes")
      .withIndex("by_comment_owner", (q) =>
        q.eq("commentId", args.commentId).eq("ownerId", user.subject)
      )
      .first();

    if (!existingLike) {
      throw new ConvexError("Not liked yet");
    }

    await ctx.db.delete(existingLike._id);

    const currentLikes = comment.likesCount || 0;
    return await ctx.db.patch(args.commentId, {
      likesCount: Math.max(0, currentLikes - 1),
    });
  },
});

export const getRepliesByCommentId = query({
  args: {
    commentId: v.id("comments"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { commentId, paginationOpts }) => {
    return await ctx.db
      .query("replies")
      .withIndex("by_comment", (q) => q.eq("commentId", commentId))
      .order("desc")
      .paginate(paginationOpts);
  },
});

export const replyToComment = mutation({
  args: {
    commentId: v.id("comments"),
    songId: v.id("songs"),
    reply: v.string(),
    parentReplyId: v.optional(v.id("replies")),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new ConvexError("Unauthorized");
    }

    const comment = await ctx.db.get(args.commentId);
    if (!comment) {
      throw new ConvexError("Comment not found");
    }

    if (args.parentReplyId) {
      const parentReply = await ctx.db.get(args.parentReplyId);
      if (!parentReply) {
        throw new ConvexError("Parent reply not found");
      }
    }
    await ctx.db.insert("replies", {
      commentId: args.commentId,
      songId: args.songId,
      reply: args.reply,
      ownerId: user.subject,
      ownerName: user.name ?? user.email ?? user.subject ?? "Anonymous User",
      createdAt: Date.now(),
      likesCount: 0,
      parentReplyId: args.parentReplyId,
      ownerAvatar: user.pictureUrl ? String(user.pictureUrl) : "/images/cover.webp",
    });

    const currentReplies = comment.repliesCount || 0;
    return await ctx.db.patch(args.commentId, {
      repliesCount: currentReplies + 1,
    });
  },
});

export const deleteComment = mutation({
  args: { commentId: v.id("comments") },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new ConvexError("Unauthorized");
    }

    const comment = await ctx.db.get(args.commentId);
    if (!comment) {
      throw new ConvexError("Comment not found");
    }

    if (comment.ownerId !== user.subject) {
      throw new ConvexError("Not authorized to delete this comment");
    }

    return await ctx.db.delete(args.commentId);
  },
});
