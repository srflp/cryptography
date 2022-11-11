import { Ref } from "react";
import invariant from "tiny-invariant";

export const getCanvasInstance = (ref: Ref<HTMLCanvasElement>) => {
  invariant(typeof ref !== "function", "Expected ref to be an ObjectRef");
  invariant(ref && ref.current, "Expected ref to exist");
  const context = ref.current.getContext("2d");
  invariant(context, "Expected context to exist");
  return { context, canvas: context.canvas };
};
