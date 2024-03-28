
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
export const ClipsTable = sqliteTable("clip", {
    id: text('id').primaryKey(),
    url: text('url'),
    embedUrl: text('embed_url'),
    broadcasterId: text('broadcaster_id'),
    broadcasterDisplayName: text('broadcaster_display_name'),
    creatorId: text('creator_id'),
    creatorDisplayName: text('creator_display_name'),
    videoId: text('video_id'),
    gameId: text('game_id'),
    language: text('language'),
    title: text('title'),
    views: integer('view_count'),
    creationDate: integer('creation_date', { mode: 'timestamp' }),
    thumbnailUrl: text('thumbnail_url'),
    duration: integer('duration'),
    vodOffset: integer('vod_offset'),
    isFeatured: integer('is_featured', { mode: 'boolean' }),
  });
export type Clip = typeof ClipsTable.$inferSelect;