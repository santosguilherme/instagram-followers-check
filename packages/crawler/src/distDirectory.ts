import path from "path";
import fs from "fs";

export const getDistPath = () => {
  const rootPath = process.cwd();

  return path.join(rootPath, "dist");
};

export const createDistDirectory = () => {
  const distPath = getDistPath();

  if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath);
  }
};
