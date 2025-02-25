import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";

export const getByIds = query({
  args: { ids: v.array(v.id("songs")) },
  handler: async (ctx, { ids }) => {
    const songs = [];
    for (const id of ids) {
      const song = await ctx.db.get(id);
      if (song) {
        songs.push({ id: song._id, name: song.title });
      } else {
        songs.push({ id, name: "[Deleted]" });
      }
    }
    return songs;
  },
});

export const create = mutation({
  args: { title: v.optional(v.string()), initialContent: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new ConvexError("Unathorized");
    }
    const organizationId = (user.organization_id ?? undefined) as string | undefined;

    return await ctx.db.insert("songs", {
      title: args.title ?? "Untitled",
      ownerId: user.subject,
      organizationId,
      initialContent: args.initialContent,
    });
  },
});

export const getUserProjects = query({
  args: { paginationOpts: paginationOptsValidator, search: v.optional(v.string()) },
  handler: async (ctx, { search, paginationOpts }) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new ConvexError("Unauthorized");
    }

    const organizationId = (user.organization_id ?? undefined) as string | undefined;

    if (organizationId) {
      return await ctx.db
        .query("songs")
        .withIndex("by_organization", (q) => q.eq("organizationId", organizationId))
        .paginate(paginationOpts);
    }

    return await ctx.db
      .query("songs")
      .withIndex("by_owner", (q) => q.eq("ownerId", user.subject))
      .paginate(paginationOpts);
  },
});

export const get = query({
  args: { paginationOpts: paginationOptsValidator, search: v.optional(v.string()) },
  handler: async (ctx, { search, paginationOpts }) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new ConvexError("Unauthorized");
    }

    return await ctx.db
      .query("songs")
      .withIndex("by_public", (q) => q.eq("released", true))
      .paginate(paginationOpts);
  },
});

export const removebyId = mutation({
  args: { id: v.id("songs") },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new ConvexError("Unauthorized");
    }

    const Song = await ctx.db.get(args.id);

    if (!Song) {
      throw new ConvexError("Song not found");
    }

    const isOwner = Song.ownerId === user.subject;

    if (!isOwner) {
      throw new ConvexError("Unauthorized");
    }

    return await ctx.db.delete(args.id);
  },
});

export const updateDatabyId = mutation({
  args: {
    id: v.id("songs"),
    instruments: v.array(
      v.object({
        name: v.string(),
        color: v.string(),
        data: v.array(v.number()),
        instrument: v.string(),
        pitch: v.string(),
        instrumentId: v.optional(v.float64()),
      })
    ),
    timeline: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new ConvexError("Unauthorized");
    }

    const Song = await ctx.db.get(args.id);

    if (!Song) {
      throw new ConvexError("Song not found");
    }

    const isOwner = Song.ownerId === user.subject;

    if (!isOwner) {
      throw new ConvexError("Unauthorized");
    }

    return await ctx.db.patch(args.id, { instruments: args.instruments, timeline: args.timeline });
  },
});

export const updateTitlebyId = mutation({
  args: { id: v.id("songs"), title: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new ConvexError("Unauthorized");
    }

    const Song = await ctx.db.get(args.id);

    if (!Song) {
      throw new ConvexError("Song not found");
    }

    const isOwner = Song.ownerId === user.subject;

    if (!isOwner) {
      throw new ConvexError("Unauthorized");
    }

    return await ctx.db.patch(args.id, { title: args.title });
  },
});

export const updatePublicbyId = mutation({
  args: { id: v.id("songs"), released: v.boolean() },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new ConvexError("Unauthorized");
    }

    const Song = await ctx.db.get(args.id);

    if (!Song) {
      throw new ConvexError("Song not found");
    }

    const isOwner = Song.ownerId === user.subject;

    if (!isOwner) {
      throw new ConvexError("Unauthorized");
    }

    return await ctx.db.patch(args.id, { released: args.released });
  },
});

export const getById = query({
  args: { id: v.id("songs") },
  handler: async (ctx, { id }) => {
    const song = await ctx.db.get(id);
    if (!song) {
      throw new ConvexError("Project Not Found");
    }
    return song;
  },
});
