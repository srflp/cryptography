import { useCallback, useRef, useState } from "react";
import { ImageCanvas } from "../algorithms/visual-cryptography/components/ImageCanvas";
import { getCanvasInstance } from "../getCanvasInstance";

type RGBAColor = [number, number, number, number];

const colorPixel = (arr: Uint8ClampedArray, pos: number, color: RGBAColor) => {
  arr[pos] = color[0]; // R
  arr[pos + 1] = color[1]; // G
  arr[pos + 2] = color[2]; // B
  arr[pos + 3] = color[3]; // A
};

const black: RGBAColor = [0, 0, 0, 255];
const white: RGBAColor = [255, 255, 255, 255];

const bwbwSquare = [black, white, black, white];
const wbwbSquare = [white, black, white, black];

const blackSchemaSet = [
  [bwbwSquare, wbwbSquare],
  [wbwbSquare, bwbwSquare],
];
const whiteSchemaSet = [
  [bwbwSquare, bwbwSquare],
  [wbwbSquare, wbwbSquare],
];

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

const generateShareImageData = (
  imageData: ImageData
): [ImageData, ImageData] => {
  const { width, height } = imageData;
  const shareWidth = 2 * width;
  const shareHeight = 2 * height;
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

  return [
    new ImageData(shares[0], shareWidth, shareHeight),
    new ImageData(shares[1], shareWidth, shareHeight),
  ];
};

const getSuperpositionedImageData = (
  shareImageData: [ImageData, ImageData],
  operator: Operator = "and"
): ImageData => {
  const { width: shareWidth, height: shareHeight } = shareImageData[0];

  const superpositionedPixels = new Uint8ClampedArray(
    4 * shareWidth * shareHeight
  );

  for (let i = 0; i < shareWidth * shareHeight * 4; i += 4) {
    const shareOnePixel = shareImageData[0].data[i];
    const shareTwoPixel = shareImageData[1].data[i];
    const op = (a: number, b: number) => {
      switch (operator) {
        case "and":
          return a & b;
        case "or":
          return a | b;
        case "xor":
          return a ^ b;
        case "nand":
          return ~(a & b);
        case "nor":
          return ~(a | b);
        case "xnor":
          return ~(a ^ b);
      }
    }; // negated XOR
    superpositionedPixels[i] = op(shareOnePixel, shareTwoPixel);
    superpositionedPixels[i + 1] = op(shareOnePixel, shareTwoPixel);
    superpositionedPixels[i + 2] = op(shareOnePixel, shareTwoPixel);
    superpositionedPixels[i + 3] = 255;
  }

  return new ImageData(superpositionedPixels, shareWidth, shareHeight);
};

type Operator = "and" | "or" | "xor" | "nand" | "nor" | "xnor";

export default function Home() {
  const [imgFile, setImgFile] = useState<File>();
  const originalImageCanvasRef = useRef<HTMLCanvasElement>(null);
  const shareOneCanvasRef = useRef<HTMLCanvasElement>(null);
  const shareTwoCanvasRef = useRef<HTMLCanvasElement>(null);
  const superpositionedSharesCanvasRef = useRef<HTMLCanvasElement>(null);

  const getShares = useCallback((): {
    imageData: [ImageData, ImageData];
    dimensions: { width: number; height: number };
  } => {
    const { context: shareOneContext } = getCanvasInstance(shareOneCanvasRef);
    const { context: shareTwoContext } = getCanvasInstance(shareTwoCanvasRef);

    const { canvas } = getCanvasInstance(originalImageCanvasRef);
    const { width, height } = canvas;
    const dimensions = { width: 2 * width, height: 2 * height };

    return {
      imageData: [
        shareOneContext.getImageData(0, 0, dimensions.width, dimensions.height),
        shareTwoContext.getImageData(0, 0, dimensions.width, dimensions.height),
      ],
      dimensions,
    };
  }, []);

  const renderSuperpositionedShares = useCallback(
    (operator?: Operator) => {
      const {
        canvas: superpositionedSharesCanvas,
        context: superpositionedSharesCanvasContext,
      } = getCanvasInstance(superpositionedSharesCanvasRef);

      const { imageData, dimensions } = getShares();
      superpositionedSharesCanvas.width = dimensions.width;
      superpositionedSharesCanvas.height = dimensions.height;

      const superpositionedSharesImageData = getSuperpositionedImageData(
        imageData,
        operator
      );
      superpositionedSharesCanvasContext.putImageData(
        superpositionedSharesImageData,
        0,
        0
      );
    },
    [getShares]
  );

  const handleImageLoad = useCallback(
    (context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      // render share canvases
      const { canvas: shareOneCanvas, context: shareOneCanvasContext } =
        getCanvasInstance(shareOneCanvasRef);
      const { canvas: shareTwoCanvas, context: shareTwoCanvasContext } =
        getCanvasInstance(shareTwoCanvasRef);

      const shareWidth = 2 * canvas.width;
      const shareHeight = 2 * canvas.height;
      shareOneCanvas.width = shareWidth;
      shareOneCanvas.height = shareHeight;
      shareTwoCanvas.width = shareWidth;
      shareTwoCanvas.height = shareHeight;

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

      const [shareOne, shareTwo] = generateShareImageData(imageData);
      shareOneCanvasContext.putImageData(shareOne, 0, 0);
      shareTwoCanvasContext.putImageData(shareTwo, 0, 0);

      // render superpositioned shares
      renderSuperpositionedShares();
    },
    [renderSuperpositionedShares]
  );

  return (
    <div>
      <div>
        Wybierz zdjęcie, którego zawartości zostanie zakodowana w dwóch
        udziałach
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (!e.target.files) return;
          const file = e.target.files[0];
          setImgFile(file);
        }}
      />
      {imgFile && (
        <>
          <ImageCanvas
            className="border border-black"
            imgFile={imgFile}
            ref={originalImageCanvasRef}
            onImageLoad={handleImageLoad}
          />
          <div className="flex">
            <div>
              <div>Udział 1</div>
              <ImageCanvas
                className="border border-blue-400"
                ref={shareOneCanvasRef}
              />
            </div>
            <div>
              <div>Udział 2</div>
              <ImageCanvas
                className="border border-blue-400"
                ref={shareTwoCanvasRef}
              />
            </div>
          </div>
          <div>Złożenie udziałów</div>
          <select
            name="operator"
            placeholder="operator logiczny"
            onChange={(e) => {
              const operator = e.target.value as Operator;
              renderSuperpositionedShares(operator);
            }}
          >
            <option value="and">AND</option>
            <option value="or">OR</option>
            <option value="xor">XOR</option>
            <option value="nand">NAND</option>
            <option value="nor">NOR</option>
            <option value="xnor">XNOR</option>
          </select>
          <ImageCanvas
            className="border border-blue-400"
            ref={superpositionedSharesCanvasRef}
          />
        </>
      )}
    </div>
  );
}
