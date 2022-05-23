const path = require('path');
const { promises } = require('fs');
const { mkdir, unlink, copyFile, readdir } = promises;

async function copyDir() {
  try {
    mkdir(path.join(__dirname, 'files-copy'), { recursive: true });

    const files = await readdir(path.join(__dirname, 'files'));
    const copiedFiles = await readdir(path.join(__dirname, 'files-copy'));

    if (copiedFiles.length) {
      for (const file of copiedFiles) {
        await unlink(path.join(__dirname, 'files-copy', file));
      }
    }

    for (const file of files) {
      await copyFile(path.join(__dirname, 'files', file), path.join(__dirname, 'files-copy', file));
    }
  } catch (err) {
    console.error(err.message);
  }
}

copyDir();
