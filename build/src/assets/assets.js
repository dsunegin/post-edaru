"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aliasSlug = exports.getRandomIntInclusive = exports.sortRandom = exports.Capitalize = exports.getRandomImage = exports.getFiles = void 0;
const slugify = require('slugify');
const fs = require('fs').promises;
const path = require('path');
/**
 * getFiles returns a list of all files in a directory path {dirPath}
 * that match a given file extension {fileExt} (optional).
 */
const getFiles = async (dirPath, fileExt = '') => {
    // List all the entries in the directory.
    const dirents = await fs.readdir(dirPath, { withFileTypes: true });
    return (dirents
        // Omit any sub-directories.
        .filter((dirent) => dirent.isFile())
        // Ensure the file extension matches a given extension (optional).
        .filter((dirent) => fileExt.length ? dirent.name.toLowerCase().endsWith(fileExt) : true)
        // Return a list of file names.
        .map((dirent) => dirent.name));
};
exports.getFiles = getFiles;
const getRandomImage = async (dirPath) => {
    // Get a list of all Markdown files in the directory.
    const fileNames = await exports.getFiles(dirPath, '.jpg');
    // Create a list of files to read.
    const filesToRead = fileNames.map((fileName) => path.resolve(dirPath, fileName)
    //dirPath+fileName
    );
    const randFnum = exports.getRandomIntInclusive(0, filesToRead.length - 1);
    return filesToRead[randFnum];
};
exports.getRandomImage = getRandomImage;
const Capitalize = (tCap) => {
    return tCap.charAt(0).toUpperCase() + tCap.slice(1);
};
exports.Capitalize = Capitalize;
const sortRandom = (arr) => arr.sort(() => Math.random() - 0.5);
exports.sortRandom = sortRandom;
const getRandomIntInclusive = (min, max) => {
    return (Math.floor(Math.random() * (max - min + 1)) + min); /*Максимум и минимум включаются */
};
exports.getRandomIntInclusive = getRandomIntInclusive;
const aliasSlug = (text) => {
    return slugify(text, {
        remove: /[*+~.()'"!:@]/g,
        lower: true,
        strict: true, // strip special characters except replacement, defaults to `false`
    });
};
exports.aliasSlug = aliasSlug;
//# sourceMappingURL=assets.js.map