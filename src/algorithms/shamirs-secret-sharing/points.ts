import { horner } from "./horner";
import { getRandomBytes } from "./random";

export function points(a0: number, threshold: number, shareCount: number) {
  const a = [a0]; // p(0) = a0 = secret
  const p = [];

  // generate coefficients a1, a2, ..., an for the polynomial (each is a random byte (0-255))
  for (let i = 1; i < threshold; i++) {
    a[i] = getRandomBytes(1)[0];
  }

  // evaluate the polynomial at x = 1, 2, ..., shareCount
  for (let i = 1; i < shareCount + 1; i++)
    p.push({
      x: i,
      y: horner(i, a),
    });

  return p;
}
