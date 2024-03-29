import { Clip } from "./models";
import { calculateEmbedURL } from "./utils";

import { describe, expect, it } from 'vitest';

describe("calculateEmbedURL", () => {
  it("returns embed url for valid clip url", () => {
    const clipUrl =
      "https://clips.twitch.tv/CrispyDifferentNewtBabyRage-zeWa3OKHWyhoO4dh";
    const expected =
      "https://clips.twitch.tv/embed?clip=CrispyDifferentNewtBabyRage-zeWa3OKHWyhoO4dh&parent=localhost";

    expect(calculateEmbedURL(clipUrl)).toBe(expected);
  });

  it("returns null for invalid clip url", () => {
    const invalidClipUrl = "invalid";
    expect(calculateEmbedURL(invalidClipUrl)).toBeNull();
  });
});