import * as codec from "./codec";
import { BIN_ENCODING, BIT_PADDING, MAX_SHARES } from "./consts";
import { points } from "./points";
import { Buffer } from "buffer";

// n = MAX_SHARES
// x = 0 ... n
// y = n ... 2n
const scratch = new Array(2 * MAX_SHARES);

export const generateShares = (
  secret: string,
  shareCount: number,
  threshold: number
): string[] => {
  const secretBuf = Buffer.from(secret);

  const hex = codec.hex(secretBuf);
  const bin = codec.bin(hex, 16);
  // prepend 1 to get extra padding, we'll account for this later
  const parts = codec.split("1" + bin, BIT_PADDING, 2);

  for (let i = 0; i < parts.length; ++i) {
    const p = points(parts[i], threshold, shareCount);
    for (let j = 0; j < shareCount; ++j) {
      if (!scratch[j]) {
        scratch[j] = p[j].x.toString(16);
      }

      const z = p[j].y.toString(2);
      const y = scratch[j + MAX_SHARES] || "";

      // y[j] = p[j][y] + y[j]
      scratch[j + MAX_SHARES] = codec.pad(z) + y;
    }
  }

  for (let i = 0; i < shareCount; ++i) {
    const x = scratch[i];
    const y = codec.hex(scratch[i + MAX_SHARES], BIN_ENCODING);
    scratch[i] = codec.encode(x, y);
    scratch[i] = Buffer.from("0" + scratch[i], "hex");
  }

  const result = scratch.slice(0, shareCount);
  scratch.fill(0);
  return result.map((r) => r.toString("hex"));
};
