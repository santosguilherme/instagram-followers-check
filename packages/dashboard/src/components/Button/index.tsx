import React from "react";

type ButtonProps = {
  text: React.ReactNode;
};

export const Button = ({ text }: ButtonProps) => {
  return <button>{text}</button>;
};
