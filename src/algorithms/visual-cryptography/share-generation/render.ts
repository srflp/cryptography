import { getRandomInt } from "../../../utils/getRandomInt";
import { Ref } from "react";
import { getCanvasInstance } from "../../../utils/getCanvasInstance";
import { blackSchemaSet, colorPixel, whiteSchemaSet } from "./common";

export const renderShares = (
  canvasRef: Ref<HTMLCanvasElement>,
  shareCanvasRefs: [Ref<HTMLCanvasElement>, Ref<HTMLCanvasElement>]
) => {
  const { canvas, context } = getCanvasInstance(canvasRef);
  const { canvas: shareOneCanvas, context: shareOneCanvasContext } =
    getCanvasInstance(shareCanvasRefs[0]);
  const { canvas: shareTwoCanvas, context: shareTwoCanvasContext } =
    getCanvasInstance(shareCanvasRefs[1]);

  const shareWidth = 2 * canvas.width;
  const shareHeight = 2 * canvas.height;
  shareOneCanvas.width = shareWidth;
  shareOneCanvas.height = shareHeight;
  shareTwoCanvas.width = shareWidth;
  shareTwoCanvas.height = shareHeight;

  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const { width, height } = imageData;

  const shares = [
    new Uint8ClampedArray(4 * shareWidth * shareHeight),
    new Uint8ClampedArray(4 * shareWidth * shareHeight),
  ];

  for (let i = 0; i < width * height; i++) {
    const row = Math.floor(i / width);
    const newRow1 = 2 * row;
    const newRow2 = 2 * row + 1;

    const posInRow = i - row * width;
    const newPosInRow1 = 2 * posInRow;
    const newPosInRow2 = 2 * posInRow + 1;

    const rowSkip1 = newRow1 * width * 2 * 4;
    const rowSkip2 = newRow2 * width * 2 * 4;

    const posSkip1 = newPosInRow1 * 4;
    const posSkip2 = newPosInRow2 * 4;

    const isBlack =
      imageData.data[i * 4] === 0 &&
      imageData.data[i * 4 + 1] === 0 &&
      imageData.data[i * 4 + 2] === 0;

    const colorSchemaSet = isBlack ? blackSchemaSet : whiteSchemaSet;

    const schema = colorSchemaSet[getRandomInt(0, 2)];

    for (let j = 0; j < 2; j++) {
      const colorSquare = schema[j];
      colorPixel(shares[j], rowSkip1 + posSkip1, colorSquare[0]);
      colorPixel(shares[j], rowSkip1 + posSkip2, colorSquare[1]);
      colorPixel(shares[j], rowSkip2 + posSkip1, colorSquare[2]);
      colorPixel(shares[j], rowSkip2 + posSkip2, colorSquare[3]);
    }
  }

  shareOneCanvasContext.putImageData(
    new ImageData(shares[0], shareWidth, shareHeight),
    0,
    0
  );
  shareTwoCanvasContext.putImageData(
    new ImageData(shares[1], shareWidth, shareHeight),
    0,
    0
  );
};
