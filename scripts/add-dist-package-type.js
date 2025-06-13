import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const writeTypeFile = (folder, type) => {
  const filePath = path.join(__dirname, '../dist', folder, 'package.json');
  fs.writeFileSync(filePath, JSON.stringify({ type }, null, 2));
};

writeTypeFile('cjs', 'commonjs');
writeTypeFile('esm', 'module');
