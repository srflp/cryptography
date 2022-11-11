import { FC, PropsWithChildren } from "react";

export const SubTitle: FC<PropsWithChildren> = ({ children }) => {
  return <h2 className="text-xl font-bold mt-4 mb-1">{children}</h2>;
};

export const Paragraph: FC<PropsWithChildren> = ({ children }) => {
  return <p className="mb-0.5">{children}</p>;
};
