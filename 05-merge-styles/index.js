const fs = require('fs').promises;
const path = require('path');
const { stdout } = process;

const pathStyles = path.join(__dirname, 'styles');
const pathBundle = path.resolve(__dirname, 'project-dist', 'bundle.css');

async function createBundle() {
  await fs.rm(pathBundle, { force: true, recursive: true });
  try {
    const files = await fs.readdir(pathStyles);
    files.forEach(async file => {
      if (path.extname(file) === '.css') {
        const pathFile = path.join(pathStyles, file);
        const contentFile = await fs.readFile(pathFile);
        fs.appendFile(pathBundle, contentFile);
      }
    });
  } catch (err) { stdout.write(`Well, it was possible to merge the files: ${err}`); }
}

createBundle();