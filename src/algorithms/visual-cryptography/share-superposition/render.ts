import { Ref } from "react";
import { getCanvasInstance } from "../../../utils/getCanvasInstance";
import { defaultOperator, Operator } from "./common";

export const renderShareSuperposition = (
  shareCanvasRefs: [Ref<HTMLCanvasElement>, Ref<HTMLCanvasElement>],
  canvasRef: Ref<HTMLCanvasElement>,
  operator: Operator = defaultOperator
) => {
  const { context: shareOneContext, canvas } = getCanvasInstance(
    shareCanvasRefs[0]
  );
  const { context: shareTwoContext } = getCanvasInstance(shareCanvasRefs[1]);

  const { width, height } = canvas;

  const {
    canvas: superpositionedSharesCanvas,
    context: superpositionedSharesCanvasContext,
  } = getCanvasInstance(canvasRef);

  superpositionedSharesCanvas.width = width;
  superpositionedSharesCanvas.height = height;

  const superpositionedSharesImageData = getSuperpositionedImageData(
    [
      shareOneContext.getImageData(0, 0, width, height),
      shareTwoContext.getImageData(0, 0, width, height),
    ],
    operator
  );
  superpositionedSharesCanvasContext.putImageData(
    superpositionedSharesImageData,
    0,
    0
  );
};

const getSuperpositionedImageData = (
  shareImageData: [ImageData, ImageData],
  operator: Operator
): ImageData => {
  const { width: shareWidth, height: shareHeight } = shareImageData[0];

  const superpositionedPixels = new Uint8ClampedArray(
    4 * shareWidth * shareHeight
  );

  const op = (a: number, b: number) => {
    if (!a && !b) return +operator[0] * 255;
    if (!a && b) return +operator[1] * 255;
    if (a && !b) return +operator[2] * 255;
    return +operator[3] * 255;
  };

  for (let i = 0; i < shareWidth * shareHeight * 4; i += 4) {
    const shareOnePixel = shareImageData[0].data[i];
    const shareTwoPixel = shareImageData[1].data[i];

    superpositionedPixels[i] = op(shareOnePixel, shareTwoPixel);
    superpositionedPixels[i + 1] = op(shareOnePixel, shareTwoPixel);
    superpositionedPixels[i + 2] = op(shareOnePixel, shareTwoPixel);
    superpositionedPixels[i + 3] = 255;
  }

  return new ImageData(superpositionedPixels, shareWidth, shareHeight);
};
