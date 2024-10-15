import { createBrotliCompress, createBrotliDecompress } from 'zlib';
import { createReadStream, createWriteStream } from 'fs';
import { checkExists, getAbsolutePath } from './path-utils.js';

export const compress = async (rl, filePath, destPath, currentDir) => {
    const sourceFilePath = getAbsolutePath(filePath, currentDir);
    const destinationFilePath = getAbsolutePath(destPath, currentDir);

    try {
        await checkExists(sourceFilePath);
        const input = createReadStream(sourceFilePath);
        const output = createWriteStream(destinationFilePath);
        const brotli = createBrotliCompress();

        input.pipe(brotli).pipe(output);
    } catch (error) {
        console.error('Operation failed');
        clearLine(rl);
    }
};

export const decompress = async (rl, filePath, destPath) => {
    try {
        await checkExists(filePath, 'file');
        const input = createReadStream(filePath);
        const output = createWriteStream(destPath);
        const brotli = createBrotliDecompress();

        input.pipe(brotli).pipe(output);
        output.on('finish', () => {
            console.log(`File decompressed successfully.`);
            clearLine(rl);
        });
    } catch (error) {
        console.error('Operation failed');
        clearLine(rl);
    }
};