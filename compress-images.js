const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imageDir = './image';

function compressImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const outputPath = filePath;

  if (ext === '.jpg' || ext === '.jpeg') {
    return sharp(filePath)
      .jpeg({ quality: 80 })
      .toFile(outputPath + '_temp')
      .then(() => fs.renameSync(outputPath + '_temp', outputPath));
  } else if (ext === '.png') {
    return sharp(filePath)
      .png({ quality: 80 })
      .toFile(outputPath + '_temp')
      .then(() => fs.renameSync(outputPath + '_temp', outputPath));
  }
}

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath, callback);
    } else {
      callback(filePath);
    }
  });
}

walkDir(imageDir, (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
    console.log(`Compressing ${filePath}`);
    compressImage(filePath).catch(err => console.error(err));
  }
});

console.log('Image compression completed.');