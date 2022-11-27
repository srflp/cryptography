import { ChangeEvent, Ref, useCallback, useRef, useState } from "react";
import { ImageCanvas } from "../algorithms/visual-cryptography/shared/ImageCanvas";
import { getCanvasInstance } from "../utils/getCanvasInstance";

const copyDimensions = (from: HTMLCanvasElement, to: HTMLCanvasElement) => {
  to.width = from.width;
  to.height = from.height;
};

const renderHiddenMessageImage = (
  canvasRef: Ref<HTMLCanvasElement>,
  hiddenMessageImageRef: Ref<HTMLCanvasElement>,
  message: string
) => {
  const { canvas, context } = getCanvasInstance(canvasRef);
  const { canvas: messageCanvas, context: messageCanvasContext } =
    getCanvasInstance(hiddenMessageImageRef);

  copyDimensions(canvas, messageCanvas);

  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const { width, height } = imageData;

  const hiddenMessageImage = new Uint8ClampedArray(imageData.data);

  for (let [i, letter] of [...message].entries()) {
    const letterCode = letter.charCodeAt(0);

    /** jump every three pixels */
    const skip = 4 * 3 * i;

    /**
     * RGBA
     * [0, 1, 2, X] pixel1
     * [4, 5, 6, X] pixel2
     * [8, 9, X, X] pixel3
     */
    const map = [0, 1, 2, 4, 5, 6, 8, 9];
    for (let j = 0; j < 8; j++) {
      const k = map[j];

      /**
       *
       */
      hiddenMessageImage[skip + i + k] &=
        ((hiddenMessageImage[skip + i + k] >> 1) << 1) |
        ((letterCode >> j) & 1);
    }
  }

  messageCanvasContext.putImageData(
    new ImageData(hiddenMessageImage, width, height),
    0,
    0
  );
};

export default function Steganography() {
  const [encodeImgFile, setEncodeImgFile] = useState<File>();
  const [decodeImgFile, setDecodeImgFile] = useState<File>();

  const inputRef = useRef<HTMLInputElement>(null);
  const originalImageCanvasRef = useRef<HTMLCanvasElement>(null);
  const hiddenMessageImageRef = useRef<HTMLCanvasElement>(null);
  const decodedCanvasRef = useRef<HTMLCanvasElement>(null);
  const decodedMessageRef = useRef<HTMLParagraphElement>(null);

  const handleImageLoad = useCallback(
    () =>
      renderHiddenMessageImage(
        originalImageCanvasRef,
        hiddenMessageImageRef,
        inputRef?.current?.value ?? ""
      ),
    []
  );

  const handleMessageChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      renderHiddenMessageImage(
        originalImageCanvasRef,
        hiddenMessageImageRef,
        e.target.value
      ),
    []
  );

  const loadExampleImage = useCallback(async () => {
    const response = await fetch("/visual-cryptography/example.png");
    const blob = await response.blob();
    const file = new File([blob], "example.png", { type: "image/png" });
    setEncodeImgFile(file);
  }, []);

  const handleImageDecryption = useCallback(() => {
    decodedMessageRef.current.innerHTML = "hello";
  }, []);

  return (
    <div className="prose dark:prose-invert max-w-none mb-10">
      <h2>Steganografia</h2>
      <div className="grid grid-cols-2">
        <section>
          <h3 className="mt-0">Ukrywanie wiadomości</h3>
          {!encodeImgFile && (
            <p>Wybierz zdjęcie, w którym ukryjesz wiadomość</p>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (!e.target.files) return;
              const file = e.target.files.item(0);
              if (!file) return;
              setEncodeImgFile(file);
            }}
          />
          <button type="button" onClick={loadExampleImage}>
            Użyj przykładowego zdjęcia
          </button>
          <br />
          <label htmlFor="textToHide" className="mr-2">
            Tekst do ukrycia:
          </label>
          <input
            name="textToHide"
            type="text"
            placeholder=""
            className="border border-black rounded mt-3 p-0.5 px-1"
            onChange={handleMessageChange}
            ref={inputRef}
          />
          {encodeImgFile && (
            <>
              <h3>Wczytany obraz</h3>
              <ImageCanvas
                className="border border-black dark:border-white"
                imgFile={encodeImgFile}
                ref={originalImageCanvasRef}
                onImageLoad={handleImageLoad}
              />
              <h3>Obraz z ukrytą wiadomością</h3>
              <ImageCanvas
                className="border border-black dark:border-white"
                ref={hiddenMessageImageRef}
              />
            </>
          )}
        </section>
        <section>
          <h3 className="mt-0">Dekodowanie wiadomości</h3>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (!e.target.files) return;
              const file = e.target.files.item(0);
              if (!file) return;
              setDecodeImgFile(file);
            }}
          />

          {decodeImgFile && (
            <>
              <h3>Wczytany obraz</h3>
              <ImageCanvas
                className="border border-black dark:border-white"
                imgFile={decodeImgFile}
                ref={decodedCanvasRef}
                onImageLoad={handleImageDecryption}
              />
              <p>
                Ukryta wiadomość:
                <span ref={decodedMessageRef}>{hiddenMessage}</span>
              </p>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
