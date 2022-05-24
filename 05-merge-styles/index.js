const path = require('path');
const { promises } = require('fs');
const { readdir, unlink, readFile, appendFile } = promises;

async function mergeStyles() {
  try {
    const sourceFiles = await readdir(path.join(__dirname, 'styles'), { withFileTypes: true });
    const distFiles = await readdir(path.join(__dirname, 'project-dist'), { withFileTypes: true });

    if (distFiles.length) {
      for (let i = 0; i < distFiles.length; i++) {
        if (path.basename(distFiles[i].name) === 'bundle.css') {
          await unlink(path.join(__dirname, 'project-dist', 'bundle.css'));
          break;
        }
      }
    }

    for (const file of sourceFiles) {
      if (file.isFile()) {
        if (path.extname(file.name) === '.css') {
          const stylesChunk = `${await readFile(path.join(__dirname, 'styles', file.name))}\n`;
          await appendFile(path.join(__dirname, 'project-dist', 'bundle.css'), stylesChunk);
        }
      }
    }
  } catch (err) {
    console.error(err.message);
  }
}

mergeStyles();
