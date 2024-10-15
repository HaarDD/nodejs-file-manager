import crypto from 'crypto';
import fs from 'fs';
import { checkExists, getAbsolutePath } from './path-utils.js';

export const calculateHash = async (rl, filePath, currentDir) => {
    const targetFilePath = getAbsolutePath(filePath, currentDir);

    try {
        await checkExists(targetFilePath);
        const hash = crypto.createHash('sha256');
        const stream = fs.createReadStream(targetFilePath);

        stream.on('data', (data) => hash.update(data));
        stream.on('end', () => {
            console.log(hash.digest('hex'));
            clearLine(rl);
        });
        stream.on('error', () => {
            console.error('Operation failed');
            clearLine(rl);
        });
    } catch (error) {
        console.error('File does not exist');
        clearLine(rl);
    }
};