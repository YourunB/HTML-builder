const fs = require('fs').promises;
const { writeFile } = require('fs');
const path = require('path');
const { stdout } = process;

const pathFolder = path.resolve(__dirname);
const pathFolderAssets = path.resolve(__dirname, 'assets');

const pathNewFolderProject = path.resolve(__dirname, 'project-dist');
const pathNewFolderAssets = path.resolve(__dirname + '/project-dist/', 'assets');

const pathStyles = path.join(__dirname, 'styles');
const pathBundle = path.join(__dirname + '/project-dist/', 'style.css');

const pathComponents = path.join(__dirname, 'components');
const componentsObj = {};

async function createNewFolder(path) {
  try { 
    await fs.mkdir(path, { recursive: true });
  } 
  catch (err) { stdout.write(`\nAn error occurred while creating a folder: ${err}`); }
}

async function copyFiles(pathFrom, pathTo) {
  try {
    const files = await fs.readdir(pathFrom, { withFileTypes: true });
    files.forEach(async file => {
      if (file.isFile()) {
        await fs.copyFile(
          path.resolve(pathFrom, file.name),
          path.resolve(pathTo, file.name),
        );
      }
      if (file.isDirectory()) {
        const oldFolderPath = `${pathFrom}/${file.name}`;
        const newFolderPath = `${pathTo}/${file.name}`;
        await createNewFolder(newFolderPath);
        await copyFiles(oldFolderPath, newFolderPath);
      }
    });
  } catch (err) { stdout.write(`\nAn error occurred while copying: ${err}`); }
}

async function createStyleFile() {
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

async function createIndexHtml(pathFrom, pathTo) {
  try {
    const files = await fs.readdir(pathFrom, { withFileTypes: true });
    files.forEach(async file => {
      if (file.isFile() && file.name === 'template.html') {
        await fs.copyFile(
          path.resolve(pathFrom, file.name),
          path.resolve(pathTo, file.name),
        );
        await fs.rename(pathTo + '/template.html', pathTo + '/index.html', function(err) {
          if ( err ) console.log('ERROR: ' + err);
        });
      }
    });
  } catch (err) { stdout.write(`\nAn error occurred while copying: ${err}`); }
}

async function getComponentsContent() {
  try {
    const files = await fs.readdir(pathComponents);
    files.forEach(async file => {
      if (path.extname(file) === '.html') {
        const pathFile = path.join(pathComponents, file);
        const contentFile = '' + await fs.readFile(pathFile);
        const component = file.slice(0, -5);
        componentsObj[component] = contentFile;
      }
      await addComponentsContentToIndexHtml();
    });
  } catch (err) { stdout.write(`Error: ${err}`); }
}

async function addComponentsContentToIndexHtml() {
  try {
    const pathFile = path.join(__dirname + '/project-dist/', 'index.html');
    let indexContent = '' + await fs.readFile(pathFile, 'utf-8');
    for (let key in componentsObj) {
      while (indexContent.includes(`{{${key}}}`)) {
        indexContent = indexContent.replace(`{{${key}}}`, componentsObj[key]);
      }
    }
    saveComponentsContentToIndexHtml(indexContent);
  } catch (err) { stdout.write(`${err}`); }
}

async function saveComponentsContentToIndexHtml(indexContent) {
  try {
    const fs = require('fs');
    const file = path.join(__dirname + '/project-dist/', 'index.html');
    const fileStream = fs.createWriteStream(file);
    fileStream.write(indexContent);
  } catch (err) { stdout.write(`${err}`); }
}

async function createBundle() {
  await fs.rm(pathNewFolderProject, { force: true, recursive: true });
  await createNewFolder(pathNewFolderProject);
  await createNewFolder(pathNewFolderAssets);
  await copyFiles(pathFolderAssets, pathNewFolderAssets);
  await createStyleFile();
  await createIndexHtml(pathFolder, pathNewFolderProject);
  await getComponentsContent();
}

createBundle();
