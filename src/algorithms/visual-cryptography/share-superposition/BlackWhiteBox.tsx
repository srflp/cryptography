import cx from "classnames";
import { FC } from "react";

export const BlackBox = (
  <div
    className={cx("w-6 h-6 border border-black dark:border-white bg-black")}
  />
);

export const WhiteBox = (
  <div
    className={cx("w-6 h-6 border border-black dark:border-white bg-white")}
  />
);

interface Props {
  onClick: () => void;
  value: boolean;
}

export const BlackWhiteBox: FC<Props> = ({ onClick, value }) => (
  <button
    type="button"
    className={cx("w-6 h-6 border border-black dark:border-white text-center", {
      "bg-white text-black": value,
      "bg-black text-white": !value,
    })}
    onClick={onClick}
  />
);
