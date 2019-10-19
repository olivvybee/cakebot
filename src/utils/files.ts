import { readdirSync, statSync } from 'fs';
import { dirname, resolve, join } from 'path';

export const requireDirectory = (m: NodeModule, subPath?: string) => {
  const path = subPath
    ? resolve(dirname(m.filename), subPath)
    : dirname(m.filename);

  const files: { [name: string]: any } = {};

  readdirSync(path).forEach(filename => {
    const fullName = join(path, filename);

    if (statSync(fullName).isDirectory()) {
      const directoryFiles = requireDirectory(m, fullName);
      if (Object.keys(directoryFiles).length) {
        files[filename] = directoryFiles;
      }
    } else {
      if (fullName !== m.filename) {
        const key = filename.substring(0, filename.lastIndexOf('.'));
        const imported = m.require(fullName);
        files[key] = imported;
      }
    }
  });

  return files;
};
