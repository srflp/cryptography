import {
  FC,
  HTMLAttributes,
  InputHTMLAttributes,
  PropsWithChildren,
  ReactElement,
} from "react";
import cx from "classnames";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  after?: ReactElement | null;
}

export const Input: FC<InputProps> = ({ label, type, after, ...props }) => {
  return (
    <label className="text-sm">
      {label}
      <div className="flex gap-2 flex-shrink-0">
        <input
          type={type ?? "text"}
          className="border-black border-2 rounded-md w-full py-2 px-3"
          {...props}
        />
        {after}
      </div>
    </label>
  );
};

export const InputContainer: FC<
  PropsWithChildren<HTMLAttributes<HTMLDivElement>>
> = ({ children, className, ...props }) => {
  return (
    <div
      className={cx("not-prose max-w-96 flex flex-col gap-2", className)}
      {...props}
    >
      {children}
    </div>
  );
};
