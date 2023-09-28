import React from "react";

type ChipProps = {
  label: string;
};

export const Chip = ({ label }: ChipProps) => {
  return <span>{label}</span>;
};
