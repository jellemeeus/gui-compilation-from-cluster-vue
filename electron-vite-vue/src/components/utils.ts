import { Clip } from "./models";

export function calculateEmbedURL(clip: Clip): string {
  if (clip.embed_url !== null){
  return `${clip.embed_url}&parent=localhost`
  }
  // calculate embed_url form url
  // url https://clips.twitch.tv/CrispyDifferentNewtBabyRage-zeWa3OKHWyhoO4dh
  // https://clips.twitch.tv/embed?clip=CrispyDifferentNewtBabyRage-zeWa3OKHWyhoO4dh
  const splitted = clip.url.split("https://clips.twitch.tv/", 1);
  return `https://clips.twitch.tv/embed?clip=${splitted[1]}&parent=localhost`
}