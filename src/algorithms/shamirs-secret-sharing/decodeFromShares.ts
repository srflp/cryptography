import { MAX_SHARES } from "./consts";
import { exps, logs } from "./table";

function lagrange(x: number, p: [number[], number[]]) {
  const n = MAX_SHARES;
  let product = 0;
  let sum = 0;

  for (let i = 0; i < p[0].length; ++i) {
    if (p[1][i]) {
      product = logs[p[1][i]];

      for (let j = 0; j < p[0].length; ++j) {
        // m != j
        if (i !== j) {
          if (x === p[0][j]) {
            product = -1;
            break;
          }

          const a = logs[x ^ p[0][j]] - logs[p[0][i] ^ p[0][j]];
          product = (product + a + n) % n;
        }
      }

      sum = -1 === sum ? sum : sum ^ exps[product];
    }
  }

  return sum;
}

export function decodeFromShares(shares: string[]) {
  const x = [];
  const y: number[][] = [];
  const t = shares.length;

  for (let i = 0; i < t; ++i) {
    const id = parseInt(shares[i].slice(0, 2), 16);
    const data = shares[i].slice(2);

    if (x.indexOf(id) === -1) {
      x.push(id);

      for (let j = 0; j < data.length / 2; j++) {
        if (!y[j]) {
          y[j] = [];
        }
        y[j][x.length - 1] = parseInt(data.slice(2 * j, 2 * j + 2), 16);
      }
    }
  }
  y.reverse();

  const ps = [];
  for (let i = 0; i < y.length; i++) {
    const p = lagrange(0, [x, y[i]]);
    ps.push(p);
  }

  const endOfSecret = ps.at(-1) === 0 ? ps.indexOf(0) : ps.length;
  const encodedSecret = ps.slice(0, endOfSecret);
  return new TextDecoder().decode(new Uint8Array(encodedSecret));
}
