import { ImageCanvas } from "./shared/ImageCanvas";
import { FC, Ref, useState } from "react";
import {
  BlackBox,
  BlackWhiteBox,
  WhiteBox,
} from "./share-superposition/BlackWhiteBox";
import { defaultOperator, Operator } from "./share-superposition/common";
import { renderShareSuperposition } from "./share-superposition/render";

interface Props {
  shareCanvasRefs: [Ref<HTMLCanvasElement>, Ref<HTMLCanvasElement>];
  canvasRef: Ref<HTMLCanvasElement>;
}

export const ShareSuperposition: FC<Props> = ({
  shareCanvasRefs,
  canvasRef,
}) => {
  const [operator, setOperator] = useState<Operator>(defaultOperator);

  return (
    <>
      <h3>Złożenie udziałów</h3>
      <div className="flex flex-col gap-2 mb-3">
        {[0, 1, 2, 3].map((i) => {
          const [a, b] = i.toString(2).padStart(2, "0").split("").map(Number);
          return (
            <div className="flex gap-3" key={i}>
              {a ? WhiteBox : BlackBox}
              <span className="self-center">+</span>
              {b ? WhiteBox : BlackBox}
              <span>=</span>
              <BlackWhiteBox
                onClick={() => {
                  const newOperator = [...operator] as Operator;
                  newOperator[i] = !operator[i];
                  setOperator(newOperator);
                  renderShareSuperposition(
                    shareCanvasRefs,
                    canvasRef,
                    newOperator
                  );
                }}
                value={operator[i]}
              />
            </div>
          );
        })}
      </div>
      <ImageCanvas className="border border-black" ref={canvasRef} />
    </>
  );
};
