export type RGBAColor = [number, number, number, number];

export const colorPixel = (
  arr: Uint8ClampedArray,
  pos: number,
  color: RGBAColor
) => {
  arr[pos] = color[0]; // R
  arr[pos + 1] = color[1]; // G
  arr[pos + 2] = color[2]; // B
  arr[pos + 3] = color[3]; // A
};

const black: RGBAColor = [0, 0, 0, 255];
const white: RGBAColor = [255, 255, 255, 255];

const bwbwSquare = [black, white, black, white];
const wbwbSquare = [white, black, white, black];

export const blackSchemaSet = [
  [bwbwSquare, wbwbSquare],
  [wbwbSquare, bwbwSquare],
];
export const whiteSchemaSet = [
  [bwbwSquare, bwbwSquare],
  [wbwbSquare, wbwbSquare],
];
