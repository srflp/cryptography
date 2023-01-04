import {
  BIN_ENCODING,
  BIT_COUNT,
  BIT_SIZE,
  BYTES_PER_CHARACTER,
  UTF8_ENCODING,
} from "./consts";
import { Buffer } from "buffer";
import { zeroes } from "./table";

export function pad(string: string, multiple: number = BIT_COUNT) {
  let missing = 0;
  let result = string;

  if (string) {
    missing = string.length % multiple;
  }

  if (missing) {
    const offset = -(multiple - missing + string.length);
    result = (zeroes + string).slice(offset);
  }

  return result;
}

export function hex(
  buffer: Uint8Array | string,
  encoding: string = UTF8_ENCODING
) {
  const padding = BYTES_PER_CHARACTER;

  if ("string" === typeof buffer) {
    return fromString();
  }

  if (Buffer.isBuffer(buffer) || buffer instanceof Uint8Array) {
    return fromBuffer();
  }

  throw new TypeError("Expecting a string or buffer as input.");

  function fromString() {
    const chunks = [];

    if (UTF8_ENCODING === encoding) {
      for (let i = 0; i < buffer.length; ++i) {
        const chunk = String.fromCharCode(buffer[i]).toString(16);
        chunks.unshift(pad(chunk, padding));
      }
    }

    if (BIN_ENCODING === encoding) {
      buffer = pad(buffer, 4);

      for (let i = buffer.length; i >= 4; i -= 4) {
        const bits = buffer.slice(i - 4, i);
        const chunk = parseInt(bits, 2).toString(16);
        chunks.unshift(chunk);
      }
    }

    return chunks.join("");
  }

  function fromBuffer() {
    const chunks = [];

    for (let i = 0; i < buffer.length; i++) {
      const chunk = buffer[i].toString(16);
      chunks.unshift(pad(chunk, padding));
    }

    return chunks.join("");
  }
}

export function bin(buffer: Uint8Array | string, radix = 16) {
  const chunks = [];

  for (let i = buffer.length - 1; i >= 0; --i) {
    let chunk = null;

    if (Buffer.isBuffer(buffer)) {
      chunk = buffer[i];
    }

    if ("string" === typeof buffer) {
      chunk = parseInt(buffer[i], radix);
    }

    if (Array.isArray(buffer)) {
      chunk = buffer[i];

      if ("string" === typeof chunk) {
        chunk = parseInt(chunk, radix);
      }
    }

    if (null === chunk) {
      throw new TypeError("Unsupported type for chunk in buffer array.");
    }

    chunks.unshift(pad(chunk.toString(2), 4));
  }

  return chunks.join("");
}

export function encode(id, data) {
  id = parseInt(id, 16);

  const padding = (BIT_SIZE - 1).toString(16).length;
  const header = Buffer.concat([
    Buffer.from(BIT_COUNT.toString(36).toUpperCase()), // 8
    Buffer.from(pad(id.toString(16), padding)),
  ]);

  if (false === Buffer.isBuffer(data)) {
    data = Buffer.from(data);
  }

  return Buffer.concat([header, data]);
}

export function decode(buffer, encoding) {
  const padding = BYTES_PER_CHARACTER;
  const offset = padding;
  const chunks = [];

  if (Buffer.isBuffer(buffer)) {
    buffer = buffer.toString(encoding);
  }

  buffer = pad(buffer, padding);

  for (let i = 0; i < buffer.length; i += offset) {
    const bits = buffer.slice(i, i + offset);
    const chunk = parseInt(bits, 16);
    chunks.unshift(chunk);
  }

  return Buffer.from(chunks);
}

export function split(string: string, padding: number, radix: number) {
  const chunks = [];
  let i;

  if (Buffer.isBuffer(string)) {
    string = string.toString();
  }

  if (padding) {
    string = pad(string, padding);
  }

  for (i = string.length; i > BIT_COUNT; i -= BIT_COUNT) {
    const bits = string.slice(i - BIT_COUNT, i);
    const chunk = parseInt(bits, radix);
    chunks.push(chunk);
  }

  chunks.push(parseInt(string.slice(0, i), radix));

  return chunks;
}
