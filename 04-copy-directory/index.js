const fs = require('fs').promises;
const path = require('path');
const { stdout } = process;

const pathFolder = path.resolve(__dirname, 'files');
const pathNewFolder = path.resolve(__dirname, 'files-copy');

async function createNewFolder() {
  try { 
    await fs.rm(pathNewFolder, { force: true, recursive: true });
    await fs.mkdir(pathNewFolder, { recursive: true });
    await createNewFiles();
  } 
  catch (err) { stdout.write(`\nAn error occurred while creating a folder: ${err}`); }
}

async function createNewFiles() {
  try {
    const files = await fs.readdir(pathFolder);
    files.forEach((file) => {
      stdout.write(`\nFile *${file}* was copied successfully.`);
      fs.copyFile(
        path.resolve(pathFolder, file),
        path.resolve(pathNewFolder, file),
      );
    });
  } catch (err) { stdout.write(`\nAn error occurred while copying: ${err}`); }
}

createNewFolder();
  