import { BYTE_PADDING } from "./consts";
import { points } from "./points";
import { Dispatch, SetStateAction } from "react";

// example
// https://apogiatzis.medium.com/shamirs-secret-sharing-a-numeric-example-walkthrough-a59b288c34c4

export const generateShares = (
  secret: string,
  shareCount: number,
  threshold: number,
  setGeneratingInfo: Dispatch<SetStateAction<Record<string, any>>>
): string[] => {
  const secretBuf = new TextEncoder().encode(secret);
  setGeneratingInfo((info) => ({
    ...info,
    secretDec: secretBuf.join(" "),
    secretLen: secretBuf.length,
  }));

  // append 1 to get extra padding, we'll account for this later
  // divides binary string into 128-bit chunks (array of 16 8-bit numbers (0-255)),
  // pads with 0s if necessary to hide the length of the secret
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
  const rawShares: string[][] = Array.from({ length: shareCount }, () => []);
  for (let i = 0; i < parts.length; ++i) {
    const p = points(parts[i], threshold, shareCount);
    pArr.push(p);

    for (let j = 0; j < shareCount; j++) {
      rawShares[j].push(p[j].y.toString(16).padStart(2, "0"));
    }
  }
  const pointsXY = pArr.map((part) =>
    part.map((p) => `(${p.x},${p.y})`).join(" ")
  );
  setGeneratingInfo((info) => ({
    ...info,
    pointsXY,
    pointsXYLen: pointsXY.length,
  }));

  const result = [];
  for (let i = 0; i < shareCount; i++) {
    const str =
      "08" +
      (i + 1).toString(16).padStart(2, "0") +
      rawShares[i].reverse().join("");

    result.push(str);
  }

  return result;
};
