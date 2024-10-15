import path, { resolve } from 'path';
import fs from 'fs';
import { createReadStream, createWriteStream } from 'fs';
import { checkExists, getAbsolutePath } from './path-utils.js';

export const clearLine = (rl) => {
    rl.write(null, { ctrl: true, name: 'u' });
};

const handleCompletion = (rl, callback, currentPath, message = null, error = false) => {
    if (message) console[error ? 'error' : 'log'](message);
    clearLine(rl);
    if (callback) callback(currentPath);
};

export const up = (rl, currentPath, callback) => {
    const newPath = path.resolve(currentPath, '..');
    process.chdir(newPath);
    handleCompletion(rl, callback, newPath);
};

export const ls = async (rl, currentPath) => {
    try {
        const files = await fs.promises.readdir(currentPath, { withFileTypes: true });
        const result = files.map(file => ({
            Name: file.name,
            Type: file.isSymbolicLink() ? 'file (symlink)' :  file.isDirectory() ? 'directory' : 'file'
        })).sort((a, b) => a.Type === b.Type ? a.Name.localeCompare(b.Name) : a.Type === 'directory' ? -1 : 1);

        console.table(result);
    } catch (error) {
        console.error('Operation failed!!!');
    } finally {
        clearLine(rl);
    }
};

export const cd = async (rl, newPath, currentPath, callback) => {
    if (!newPath) return handleCompletion(rl, callback, currentPath, 'Invalid argument', true);

    const targetPath = getAbsolutePath(newPath, currentPath);

    try {
        await checkExists(targetPath, 'Directory');
        process.chdir(targetPath);
        handleCompletion(rl, callback, targetPath);
    } catch (error) {
        handleCompletion(rl, callback, currentPath, 'Operation failed', true);
    }
};

export const cat = async (rl, filePath, currentPath) => {
    if (!filePath) return handleCompletion(rl, null, currentPath, 'Invalid argument', true);

    const targetPath = getAbsolutePath(filePath, currentPath);

    try {
        await checkExists(targetPath);
        const stream = createReadStream(targetPath, 'utf-8');

        stream.on('open', () => console.log('----------\tSTART\tOF\tFILE\t----------'));
        stream.on('data', chunk => process.stdout.write(chunk));
        stream.on('end', () => {
            console.log('----------\tEND\tOF\tFILE\t----------');
            clearLine(rl);
        });
        stream.on('error', () => handleCompletion(rl, null, currentPath, 'Operation failed', true));
    } catch (error) {
        handleCompletion(rl, null, currentPath, 'Path is not a file!', true);
    }
};

export const add = async (rl, fileName, currentPath, callback) => {
    if (!fileName) return handleCompletion(rl, callback, currentPath, 'Invalid argument', true);

    const targetPath = path.resolve(currentPath, fileName);

    try {
        await checkExists(targetPath);
        handleCompletion(rl, callback, currentPath, `Operation failed: File "${fileName}" already exists.`, true);
    } catch {
        try {
            await fs.promises.open(targetPath, 'w');
            handleCompletion(rl, callback, currentPath, `File "${fileName}" created successfully.`);
        } catch (error) {
            handleCompletion(rl, callback, currentPath, 'Operation failed', true);
        }
    }
};

export const rn = async (rl, oldFileName, newFileName, currentPath, callback) => {
    if (!oldFileName || !newFileName) return handleCompletion(rl, callback, currentPath, 'Invalid argument', true);

    const oldFilePath = path.resolve(currentPath, oldFileName);
    const newFilePath = path.resolve(currentPath, newFileName);

    try {

        await checkExists(oldFilePath);

        const newFileExists = await checkExists(newFilePath).catch(() => false);
        
        if (newFileExists) {
            return handleCompletion(rl, callback, currentPath, `Operation failed: File "${newFileName}" already exists.`, true);
        }

        await fs.promises.rename(oldFilePath, newFilePath);
        handleCompletion(rl, callback, currentPath, `File "${oldFileName}" successfully renamed to "${newFileName}".`);
    } catch (error) {
        handleCompletion(rl, callback, currentPath, 'Operation failed', true);
    }
};

export const cp = async (rl, srcFile, destPath, currentPath, callback) => {
    if (!srcFile || !destPath) return handleCompletion(rl, callback, currentPath, 'Invalid argument', true);

    const srcFilePath = getAbsolutePath(srcFile, currentPath);
    const destFilePath = path.resolve(getAbsolutePath(destPath, currentPath),path.basename(srcFile))
    try {
        await checkExists(srcFilePath);
        const readStream = createReadStream(srcFilePath);
        const writeStream = createWriteStream(destFilePath);

        readStream.pipe(writeStream);
        writeStream.on('finish', () => handleCompletion(rl, callback, currentPath, `File "${path.basename(srcFilePath)}" successfully copied to "${destPath}".`));
        writeStream.on('error', () => handleCompletion(rl, callback, currentPath, 'Operation failed', true));
    } catch (error) {
        handleCompletion(rl, callback, currentPath, 'Operation failed', true);
    }
};

export const mv = async (rl, srcFile, destPath, currentPath, callback) => {
    await cp(rl, srcFile, destPath, currentPath, async () => {
        await fs.promises.unlink(srcFile);
            handleCompletion(rl, callback, currentPath, `File "${path.basename(srcFile)}" successfully moved to "${destPath}".`);
        try {
            await fs.promises.unlink(srcFile);
            handleCompletion(rl, callback, currentPath, `File "${path.basename(srcFile)}" successfully moved to "${destPath}".`);
        } catch (error) {
            handleCompletion(rl, callback, currentPath, 'Operation failed', true);
        }
    });
};

export const rm = async (rl, filePath, currentPath, callback) => {
    if (!filePath) return handleCompletion(rl, callback, currentPath, 'Invalid argument', true);

    const targetFilePath = getAbsolutePath(filePath, currentPath);

    try {
        await checkExists(targetFilePath);
        await fs.promises.unlink(targetFilePath);
        handleCompletion(rl, callback, currentPath, `File "${path.basename(targetFilePath)}" has been deleted.`);
    } catch (error) {
        handleCompletion(rl, callback, currentPath, 'Operation failed', true);
    }
};