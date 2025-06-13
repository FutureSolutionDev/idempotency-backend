import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const esmDir = path.join(__dirname, '../dist/esm');

// يعالج import/export العادية
function fixImportExportStatements(code) {
  return code.replace(
    /((?:import|export)[^'"]+?['"])(\.{1,2}\/[^'"]+?)(?<!\.mjs|\.js|\.json|\.cjs)(?=['"])/g,
    '$1$2.js'
  );
}

// يعالج dynamic import
function fixDynamicImports(code) {
  return code.replace(
    /(import\(\s*['"])(\.{1,2}\/[^'"]+?)(?<!\.mjs|\.js|\.json|\.cjs)(['"]\s*\))/g,
    '$1$2.js$3'
  );
}

function fixFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fixed = fixDynamicImports(fixImportExportStatements(content));

  if (content !== fixed) {
    fs.writeFileSync(filePath, fixed, 'utf8');
    console.log(`✔ Fixed: ${filePath}`);
  }
}

function walkAndFix(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkAndFix(fullPath);
    } else if (entry.isFile() && fullPath.endsWith('.js')) {
      fixFile(fullPath);
    }
  }
}

walkAndFix(esmDir);
