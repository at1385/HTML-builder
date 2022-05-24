const path = require('path');
const { promises } = require('fs');
const { readdir, unlink, readFile, appendFile, mkdir, copyFile } = promises;

async function clearDir(dir) {
  try {
    const files = await readdir(path.join(__dirname, dir), { withFileTypes: true });

    if (files.length) {
      for (const file of files) {
        if (file.isFile()) {
          await unlink(path.join(__dirname, dir, file.name));
        } else {
          clearDir(path.join(dir, file.name));
        }
      }
    }
  } catch (err) {
    console.error(err.message);
  }
}

async function generateHtml() {
  try {
    let templateHtml = await readFile(path.join(__dirname, 'template.html'), 'utf-8');
    const components = await readdir(path.join(__dirname, 'components'), { withFileTypes: true });

    const component = {};

    for (const file of components) {
      component[`{{${path.parse(file.name).name}}}`] = await readFile(path.join(__dirname, 'components', file.name), 'utf-8');
    }

    templateHtml = templateHtml.replace(/{{[a-z]\w+}}/gi, match => match = component[match]);

    await appendFile(path.join(__dirname, 'project-dist', 'index.html'), templateHtml);
  } catch (err) {
    console.error(err.message);
  }
}

async function mergeStyles() {
  try {
    const sourceFiles = await readdir(path.join(__dirname, 'styles'), { withFileTypes: true });

    for (const file of sourceFiles) {
      if (file.isFile()) {
        if (path.extname(file.name) === '.css') {
          const stylesChunk = `${await readFile(path.join(__dirname, 'styles', file.name))}\n`;
          await appendFile(path.join(__dirname, 'project-dist', 'style.css'), stylesChunk);
        }
      }
    }
  } catch (err) {
    console.error(err.message);
  }
}

async function copyDir(dir) {
  try {
    const sourceFiles = await readdir(path.join(__dirname, dir), { withFileTypes: true });

    await mkdir(path.join(__dirname, 'project-dist', dir), { recursive: true });
  
    for (const file of sourceFiles) {
      if (file.isFile()) {
        await copyFile(path.join(__dirname, dir, file.name), path.join(__dirname, 'project-dist', dir, file.name));
      } else {
        copyDir(path.join(dir, file.name));
      }
    }
  } catch (err) {
    console.error(err.message);
  }
}

async function buildPage() {
  try {
    mkdir(path.join(__dirname, 'project-dist'), { recursive: true });
    clearDir('project-dist');
    generateHtml();
    mergeStyles();
    copyDir('assets');
  } catch (err) {
    console.error(err.message);
  }
}

buildPage();
