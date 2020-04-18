import path from 'path';
import fs from 'fs';

export function getDistPath() {
  const rootPath = process.cwd();

  return path.join(rootPath, 'dist');
}

export function createDistDirectory() {
  const distPath = getDistPath();

  if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath);
  }
}
