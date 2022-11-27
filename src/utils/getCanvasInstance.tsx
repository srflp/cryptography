import { Ref } from "react";
import invariant from "tiny-invariant";

export const invariantRef = (ref: Ref<HTMLElement>) => {
  invariant(typeof ref !== "function", "Expected ref to be an ObjectRef");
  invariant(ref && ref.current, "Expected ref to exist");
};

export const getCanvasInstance = (ref: Ref<HTMLCanvasElement>) => {
  invariant(typeof ref !== "function", "Expected ref to be an ObjectRef");
  invariant(ref && ref.current, "Expected ref to exist");

  invariantRef(ref);
  const context = ref.current.getContext("2d");
  invariant(context, "Expected context to exist");
  return { context, canvas: context.canvas };
};
