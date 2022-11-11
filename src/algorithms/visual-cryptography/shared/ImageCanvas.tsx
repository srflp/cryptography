import { forwardRef, HTMLAttributes, useEffect } from "react";
import cx from "classnames";
import { getCanvasInstance } from "../../../utils/getCanvasInstance";

interface ImageCanvasProps
  extends Omit<HTMLAttributes<HTMLCanvasElement>, "onClick"> {
  imgFile?: File;
  onClick?: (x: number, y: number) => void;
  onImageLoad?: () => void;
  drawFn?: (context: CanvasRenderingContext2D) => void;
}

export const ImageCanvas = forwardRef<HTMLCanvasElement, ImageCanvasProps>(
  ({ imgFile, drawFn, onClick, onImageLoad, className, ...props }, ref) => {
    useEffect(() => {
      const { context, canvas } = getCanvasInstance(ref);

      if (imgFile) {
        const img = new Image();
        img.src = URL.createObjectURL(imgFile);
        img.onload = () => {
          // ignore last pixel row or column if width or height is odd
          canvas.width = img.width - (img.width % 2);
          canvas.height = img.height - (img.height % 2);
          context.drawImage(img, 0, 0, canvas.width, canvas.height);
          onImageLoad?.();
        };
      }

      if (drawFn) {
        drawFn(context);
      }
    }, [imgFile, ref, drawFn, onImageLoad]);

    return <canvas className={cx(className)} ref={ref} {...props} />;
  }
);

ImageCanvas.displayName = "ImageCanvas";
