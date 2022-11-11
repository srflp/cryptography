import { useCallback, useRef, useState } from "react";
import { ImageCanvas } from "../algorithms/visual-cryptography/shared/ImageCanvas";
import { SubTitle } from "../algorithms/shared/Title";
import { ShareSuperposition } from "../algorithms/visual-cryptography/ShareSuperposition";
import { renderShareSuperposition } from "../algorithms/visual-cryptography/share-superposition/render";
import { renderShares } from "../algorithms/visual-cryptography/share-generation/render";

export default function VisualCryptography() {
  const [imgFile, setImgFile] = useState<File>();
  const originalImageCanvasRef = useRef<HTMLCanvasElement>(null);
  const shareOneCanvasRef = useRef<HTMLCanvasElement>(null);
  const shareTwoCanvasRef = useRef<HTMLCanvasElement>(null);
  const shareSuperpositionCanvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageLoad = useCallback(() => {
    renderShares(originalImageCanvasRef, [
      shareOneCanvasRef,
      shareTwoCanvasRef,
    ]);

    renderShareSuperposition(
      [shareOneCanvasRef, shareTwoCanvasRef],
      shareSuperpositionCanvasRef
    );
  }, []);

  return (
    <div>
      {!imgFile && (
        <div>
          Wybierz zdjęcie, którego zawartość zostanie zakodowana w dwóch
          udziałach
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (!e.target.files) return;
          const file = e.target.files.item(0);
          if (!file) return;
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
          <div className="flex gap-3 overflow-auto">
            <div>
              <SubTitle>Udział 1</SubTitle>
              <ImageCanvas ref={shareOneCanvasRef} />
            </div>
            <div>
              <SubTitle>Udział 2</SubTitle>
              <ImageCanvas ref={shareTwoCanvasRef} />
            </div>
          </div>
          <ShareSuperposition
            shareCanvasRefs={[shareOneCanvasRef, shareTwoCanvasRef]}
            canvasRef={shareSuperpositionCanvasRef}
          />
        </>
      )}
    </div>
  );
}
