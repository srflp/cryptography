export const getRandomBytes = (
  typeof self !== "undefined" && self.crypto
    ? () => {
        // Browsers
        const crypto = self.crypto;
        // https://w3c.github.io/webcrypto/#Crypto-method-getRandomValues
        // "If the byteLength of array is greater than 65536,
        // throw a QuotaExceededError and terminate the algorithm."
        const QUOTA = 65536;
        return (n: number) => {
          const a = new Uint8Array(n);
          for (let i = 0; i < n; i += QUOTA) {
            crypto.getRandomValues(a.subarray(i, i + Math.min(n - i, QUOTA)));
          }
          return a;
        };
      }
    : () => {
        // Node
        return require("crypto").randomBytes;
      }
)();
