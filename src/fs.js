import path from 'path';
import fs from 'fs';
import { createReadStream, createWriteStream } from 'fs';

// Упрощённая проверка существования
const checkExists = async (targetPath, type = 'file') => {
    try {
        await fs.promises.access(targetPath, fs.constants.F_OK);
        const stats = await fs.promises.lstat(targetPath);
        if (type === 'file' && !stats.isFile()) throw new Error('Not a file');
        if (type === 'directory' && !stats.isDirectory()) throw new Error('Not a directory');
    } catch (error) {
        throw new Error('Operation failed');
    }
};

// Функция для очистки строки readline
export const clearLine = (rl) => {
    rl.write(null, { ctrl: true, name: 'u' });
};

// Универсальная обработка ошибок и завершений
const handleCompletion = (rl, callback, currentDir, message = null, error = false) => {
    if (message) console[error ? 'error' : 'log'](message);
    clearLine(rl);
    if (callback) callback(currentDir);
};

// Команда "up"
export const up = (rl, currentDir, callback) => {
    const newDir = path.resolve(currentDir, '..');
    process.chdir(newDir);
    handleCompletion(rl, callback, newDir);
};

// Команда "ls"
export const ls = async (rl, currentDir) => {
    try {
        const files = await fs.promises.readdir(currentDir, { withFileTypes: true });
        const result = files.map(file => ({
            Name: file.name,
            Type: file.isDirectory() ? 'directory' : 'file'
        })).sort((a, b) => a.Type === b.Type ? a.Name.localeCompare(b.Name) : a.Type === 'directory' ? -1 : 1);

        console.table(result);
    } catch (error) {
        console.error('Operation failed');
    } finally {
        clearLine(rl);
    }
};

// Команда "cd"
export const cd = async (rl, newDir, currentDir, callback) => {
    if (!newDir) return handleCompletion(rl, callback, currentDir, 'Invalid argument', true);

    const targetDir = path.isAbsolute(newDir) ? newDir : path.resolve(currentDir, newDir);

    try {
        await checkExists(targetDir, 'directory');
        process.chdir(targetDir);
        handleCompletion(rl, callback, targetDir);
    } catch (error) {
        handleCompletion(rl, callback, currentDir, 'Operation failed', true);
    }
};

// Команда "cat"
export const cat = async (rl, fileDir, currentDir) => {
    if (!fileDir) return handleCompletion(rl, null, currentDir, 'Invalid argument', true);

    const targetDir = path.isAbsolute(fileDir) ? fileDir : path.resolve(currentDir, fileDir);

    try {
        await checkExists(targetDir);
        const stream = createReadStream(targetDir, 'utf-8');

        stream.on('open', () => console.log('----------\tSTART\tOF\tFILE\t----------'));
        stream.on('data', chunk => process.stdout.write(chunk));
        stream.on('end', () => {
            console.log('----------\tEND\tOF\tFILE\t----------');
            clearLine(rl);
        });
        stream.on('error', () => handleCompletion(rl, null, currentDir, 'Operation failed', true));
    } catch (error) {
        handleCompletion(rl, null, currentDir, 'Path is not a file!', true);
    }
};

// Команда "add"
export const add = async (rl, fileName, currentDir, callback) => {
    if (!fileName) return handleCompletion(rl, callback, currentDir, 'Invalid argument', true);

    const targetPath = path.resolve(currentDir, fileName);

    try {
        await checkExists(targetPath);
        handleCompletion(rl, callback, currentDir, `Operation failed: File "${fileName}" already exists.`, true);
    } catch {
        try {
            await fs.promises.open(targetPath, 'w');
            handleCompletion(rl, callback, currentDir, `File "${fileName}" created successfully.`);
        } catch (error) {
            handleCompletion(rl, callback, currentDir, 'Operation failed', true);
        }
    }
};

// Команда "rn"
export const rn = async (rl, oldFileName, newFileName, currentDir, callback) => {
    if (!oldFileName || !newFileName) return handleCompletion(rl, callback, currentDir, 'Invalid argument', true);

    const oldFilePath = path.resolve(currentDir, oldFileName);
    const newFilePath = path.resolve(currentDir, newFileName);

    try {
        await checkExists(oldFilePath);
        await checkExists(newFilePath).catch(() => fs.promises.rename(oldFilePath, newFilePath));
        handleCompletion(rl, callback, currentDir, `File "${oldFileName}" successfully renamed to "${newFileName}".`);
    } catch (error) {
        handleCompletion(rl, callback, currentDir, 'Operation failed', true);
    }
};

// Команда "cp"
export const cp = async (rl, srcFile, destDir, currentDir, callback) => {
    if (!srcFile || !destDir) return handleCompletion(rl, callback, currentDir, 'Invalid argument', true);

    const srcFilePath = path.isAbsolute(srcFile) ? srcFile : path.resolve(currentDir, srcFile);
    const destFilePath = path.isAbsolute(destDir) ? destDir : path.resolve(currentDir, destDir);

    try {
        await checkExists(srcFilePath);
        const readStream = createReadStream(srcFilePath);
        const writeStream = createWriteStream(destFilePath);

        readStream.pipe(writeStream);
        writeStream.on('finish', () => handleCompletion(rl, callback, currentDir, `File "${path.basename(srcFilePath)}" successfully copied to "${destDir}".`));
        writeStream.on('error', () => handleCompletion(rl, callback, currentDir, 'Operation failed', true));
    } catch (error) {
        handleCompletion(rl, callback, currentDir, 'Operation failed', true);
    }
};

// Команда "mv"
export const mv = async (rl, srcFile, destDir, currentDir, callback) => {
    await cp(rl, srcFile, destDir, currentDir, async () => {
        try {
            await fs.promises.unlink(srcFile);
            handleCompletion(rl, callback, currentDir, `File "${path.basename(srcFile)}" successfully moved to "${destDir}".`);
        } catch (error) {
            handleCompletion(rl, callback, currentDir, 'Operation failed', true);
        }
    });
};

// Команда "rm"
export const rm = async (rl, filePath, currentDir, callback) => {
    if (!filePath) return handleCompletion(rl, callback, currentDir, 'Invalid argument', true);

    const targetFilePath = path.isAbsolute(filePath) ? filePath : path.resolve(currentDir, filePath);

    try {
        await checkExists(targetFilePath);
        await fs.promises.unlink(targetFilePath);
        handleCompletion(rl, callback, currentDir, `File "${path.basename(targetFilePath)}" has been deleted.`);
    } catch (error) {
        handleCompletion(rl, callback, currentDir, 'Operation failed', true);
    }
};