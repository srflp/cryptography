import * as codec from "./codec";
import { BIN_ENCODING, BYTE_PADDING, MAX_SHARES } from "./consts";
import { points } from "./points";
import { Buffer } from "buffer";
import { Dispatch, SetStateAction } from "react";

// n = MAX_SHARES
// x = 0 ... n
// y = n ... 2n

// https://apogiatzis.medium.com/shamirs-secret-sharing-a-numeric-example-walkthrough-a59b288c34c4
export const generateShares = (
  secret: string,
  shareCount: number,
  threshold: number,
  setGeneratingInfo: Dispatch<SetStateAction<Record<string, any>>>
): string[] => {
  const scratch = new Array(2 * MAX_SHARES);

  const secretBuf = new TextEncoder().encode(secret);
  setGeneratingInfo((info) => ({
    ...info,
    secretDec: secretBuf.join(" "),
    secretLen: secretBuf.length,
  }));

  // append 1 to get extra padding, we'll account for this later
  // divides binary string into 128-bit chunks (16 1-byte (8-bit) chunks) (array of 16 8-bit numbers (0-255))
  let parts = [...secretBuf, 1];
  for (
    let i = 0;
    i < BYTE_PADDING - (secretBuf.length % BYTE_PADDING) - 1;
    i++
  ) {
    parts.push(0);
  }
  setGeneratingInfo((info) => ({
    ...info,
    parts: parts.join(" "),
    partsLen: parts.length,
  }));
  const pArr: { x: number; y: number }[][] = [];
  for (let i = 0; i < parts.length; ++i) {
    const p = points(parts[i], threshold, shareCount);
    console.log(p);
    pArr.push(p);

    for (let j = 0; j < shareCount; ++j) {
      if (!scratch[j]) {
        scratch[j] = p[j].x.toString(16);
        // console.log("no scratch", p[j].x.toString(16));
      }

      const z = p[j].y.toString(2);
      // console.log("y", p[j].y);
      // console.log("z", z);
      const y = scratch[j + MAX_SHARES] || "";
      // console.log("y", y);
      // y[j] = p[j][y] + y[j]
      scratch[j + MAX_SHARES] = codec.pad(z) + y;
    }
  }
  const pointsXY = pArr.map((part) =>
    part.map((p) => `(${p.x},${p.y})`).join(" ")
  );
  setGeneratingInfo((info) => ({
    ...info,
    pointsXY,
    pointsXYLen: pointsXY.length,
    // scratch: scratch,
  }));

  for (let i = 0; i < shareCount; ++i) {
    const x = scratch[i];
    const y = codec.hex(scratch[i + MAX_SHARES], BIN_ENCODING);
    console.log(x, y);
    console.log([...scratch]);
    scratch[i] = codec.encode(x, y);
    console.log(codec.encode(x, y));
    scratch[i] = Buffer.from("0" + scratch[i], "hex");
  }

  const result = scratch.slice(0, shareCount);
  return result.map((r) => r.toString("hex"));
};
