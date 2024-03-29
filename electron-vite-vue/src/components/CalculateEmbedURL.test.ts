import { calculateEmbedURLfromURL } from "./utils";

import { describe, expect, it } from 'vitest';

describe("calculateEmbedURL", () => {
  it("returns embed url for valid clip url", () => {
    const clipUrl =
      "https://clips.twitch.tv/CrispyDifferentNewtBabyRage-zeWa3OKHWyhoO4dh";
    const expected =
      "https://clips.twitch.tv/embed?clip=CrispyDifferentNewtBabyRage-zeWa3OKHWyhoO4dh&parent=localhost&parent=example.com&parent=127.0.0.1";

    expect(calculateEmbedURLfromURL(clipUrl)).toEqual(expected);

  });
});