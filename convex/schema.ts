import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  songs: defineTable({
    title: v.string(),
    initialContent: v.optional(v.string()),
    ownerId: v.string(),
    roomId: v.optional(v.string()),
    organizationId: v.optional(v.string()),
    imgPath: v.optional(v.string()),
    released: v.optional(v.boolean()),
    instruments: v.optional(
      v.array(
        v.object({
          name: v.string(),
          color: v.string(),
          data: v.array(v.number()),
          instrument: v.string(),
          pitch: v.string(),
          instrumentId: v.optional(v.float64()),
        })
      )
    ),
    timeline: v.optional(v.number()),
  })
    .index("by_owner", ["ownerId"])
    .index("by_public", ["released"])
    .index("by_organization", ["organizationId"])
    .searchIndex("search_title", {
      searchField: "title",
      filterFields: ["ownerId", "organizationId"],
    })
    .searchIndex("search_owner", {
      searchField: "ownerId",
    }),
});
