import fs from "fs";
import path from "path";

import { getDistPath } from "./distDirectory";

export function write(fileName: string, json: unknown) {
  const distPath = getDistPath();

  fs.writeFile(
    path.join(distPath, `${fileName}.json`),
    JSON.stringify(json, null, 2),
    function writeJSON(err) {
      if (err) return console.log(err);
    },
  );
}
