import { Clip } from "./models";

export function calculateEmbedURL(clip: Clip): string {
  if (clip.embed_url !== null){
  return `${clip.embed_url}&parent=localhost`
  }
  return calculateEmbedURLfromURL(clip.url);
}

export function calculateEmbedURLfromURL(url: string): string {
  // check if url contains "clips.twitch.tv" before splitting
  if (!url.includes("https://clips.twitch.tv/")) {
    throw new Error("Invalid clip URL");
  }
  const splitted = url.split("https://clips.twitch.tv/")
  return `https://clips.twitch.tv/embed?clip=${splitted[1]}&parent=localhost`;
}


