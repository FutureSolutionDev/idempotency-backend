import fs from 'fs'
import path from 'path'


function renameJsToCjs(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      renameJsToCjs(fullPath);
    } else if (file.endsWith('.js')) {
      const newName = fullPath.replace(/\.js$/, '.cjs');
      fs.renameSync(fullPath, newName);
    }
  }
}

renameJsToCjs('./dist/cjs');
