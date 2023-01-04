import { horner } from "./horner";
import { random } from "./random";

function buf2hex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)]
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");
}
export function points(a0: number, threshold: number, shareCount: number) {
  const prng = random;
  const a = [a0]; // p(0) = a0 = secret
  const p = [];
  const t = threshold;
  const n = shareCount;

  for (let i = 1; i < t; ++i) {
    a[i] = parseInt(buf2hex(prng(1).buffer), 16);
  }

  for (let i = 1; i < 1 + n; ++i) {
    p[i - 1] = {
      x: i,
      y: horner(i, a),
    };
  }

  return p;
}
