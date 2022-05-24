const path = require('path');
const { promises, stat } = require('fs');
const { readdir } = promises;

async function showFilesInFolder() {
  try {
    const files = await readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true });

    for (const file of files) {
      if (file.isFile()) {
        stat(path.join(__dirname, 'secret-folder', file.name), (err, stats) => {
          if (err) return console.error(err.message);
          console.log(`${path.parse(file.name).name} - ${path.extname(file.name).slice(1)} - ${(stats.size / 1024).toFixed(3)}kb`);
        });
      }
    }
  } catch (err) {
    console.error(err.message);
  }
}

showFilesInFolder();
