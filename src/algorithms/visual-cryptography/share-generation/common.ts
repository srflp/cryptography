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

// B W
// B W
const bwbwSquare = [black, white, black, white];

// W B
// W B
const wbwbSquare = [white, black, white, black];

// B B
// W W
const bbwwSquare = [black, black, white, white];

// W W
// B B
const wwbbSquare = [white, white, black, black];

// W B
// B W
const wbbwSquare = [white, black, black, white];

// B W
// W B
const bwwbSquare = [black, white, white, black];

// complimentary squares in both shares
export const blackSchemaSet = [
  [bwbwSquare, wbwbSquare],
  [wbwbSquare, bwbwSquare],
  [bbwwSquare, wwbbSquare],
  [wwbbSquare, bbwwSquare],
  [wbbwSquare, bwwbSquare],
  [bwwbSquare, wbbwSquare],
];
// same squares in both shares
export const whiteSchemaSet = [
  [bwbwSquare, bwbwSquare],
  [wbwbSquare, wbwbSquare],
  [bbwwSquare, bbwwSquare],
  [wwbbSquare, wwbbSquare],
  [wbbwSquare, wbbwSquare],
  [bwwbSquare, bwwbSquare],
];
