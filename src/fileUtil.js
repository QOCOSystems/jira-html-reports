const fs = require('fs');
const mkdirp = require('mkdirp');
const ncp = require('ncp');

function fileExists(filePath) {
  return new Promise((resolve, reject) => {
    fs.stat(filePath, (err, stat) => {
      if (!err) resolve();
      else reject('File ' + String(filePath) + ' not found');
    });
  });
}

function readFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

function readFileIfExists(filePath) {
  return fileExists(filePath)
    .then(() => readFile(filePath));
}

function createDirectory(directory) {
  return new Promise((resolve, reject) => {
    mkdirp(directory, (err) => {
      if (err) reject(err);
      else resolve(directory);
    });
  })
}

function writeFile(data, filePath) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, data, (err) => {
      if (err) reject(err);
      else resolve(filePath);
    })
  });
}

function copyDir(src, dest) {
  return new Promise((resolve, reject) => {
    ncp(src, dest, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

const fileUtil = {
  fileExists,
  readFileIfExists,
  writeFile,
  createDirectory,
  copyDir,
};

module.exports = fileUtil;
