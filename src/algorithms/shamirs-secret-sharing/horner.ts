import { MAX_SHARES } from "./consts";
import { exps, logs } from "./table";

export function horner(x: number, a: number[]) {
  const n = MAX_SHARES;
  const t = a.length - 1;
  let b = 0;

  for (let i = t; i >= 0; i--) {
    b = 0 === b ? a[i] : exps[(logs[x] + logs[b]) % n] ^ a[i];
  }

  return b;
}
