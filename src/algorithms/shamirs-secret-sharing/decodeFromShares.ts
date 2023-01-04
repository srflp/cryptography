import * as codec from "./codec";
import { BIN_ENCODING, BIT_SIZE, MAX_SHARES } from "./consts";
import { exps, logs } from "./table";

function lagrange(x, p) {
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
function parse(input: string) {
  const share = { id: null, bits: null, data: null };

  if (Buffer.isBuffer(input)) {
    input = input.toString("hex");
  }

  if ("0" === input[0]) {
    input = input.slice(1);
  }

  // bit count is in base36
  share.bits = parseInt(input.slice(0, 1), 36);
  const maxBits = BIT_SIZE - 1;
  const idLength = maxBits.toString(16).length;
  const regex = `^([a-kA-K3-9]{1})([a-fA-F0-9]{${idLength}})([a-fA-F0-9]+)$`;
  const matches = new RegExp(regex).exec(input);

  if (matches && matches.length) {
    share.id = parseInt(matches[2], 16);
    share.data = matches[3];
  }

  return share;
}

export function decodeFromShares(shares: string[]) {
  const chunks = [];
  const x = [];
  const y = [];
  const t = shares.length;

  for (let i = 0; i < t; ++i) {
    const share = parse(Buffer.from(shares[i], "hex"));

    if (-1 === x.indexOf(share.id)) {
      x.push(share.id);

      const bin = codec.bin(share.data, 16);
      const parts = codec.split(bin, 0, 2);

      for (let j = 0; j < parts.length; ++j) {
        if (!y[j]) {
          y[j] = [];
        }
        y[j][x.length - 1] = parts[j];
      }
    }
  }

  for (let i = 0; i < y.length; ++i) {
    const p = lagrange(0, [x, y[i]]);
    chunks.unshift(codec.pad(p.toString(2)));
  }

  const string = chunks.join("");
  const bin = string.slice(1 + string.indexOf("1")); // >= 0
  const hex = codec.hex(bin, BIN_ENCODING);
  const value = codec.decode(hex);

  return value;
}
