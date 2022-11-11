import { FC, PropsWithChildren } from "react";

export const Title: FC<PropsWithChildren> = ({ children }) => {
  return <h2 className="text-2xl font-bold mt-4 mb-1">{children}</h2>;
};

export const SubTitle: FC<PropsWithChildren> = ({ children }) => {
  return <h3 className="text-xl font-bold mt-4 mb-1">{children}</h3>;
};

export const Paragraph: FC<PropsWithChildren> = ({ children }) => {
  return <p className="mb-0.5">{children}</p>;
};
