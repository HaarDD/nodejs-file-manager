import path from 'path';
import fs from 'fs';

export const checkExists = async (targetPath, type = 'file') => {
    try {
        await fs.promises.access(targetPath, fs.constants.F_OK);
        const stats = await fs.promises.lstat(targetPath);
        if(stats.isSymbolicLink()) throw new Error('Symbolic Link!')
        else if (type === 'file' && !stats.isFile() ) throw new Error('Not a file')
        else if (type === 'directory' && !stats.isDirectory()) throw new Error('Not a directory');
    } catch (error) {
        throw new Error('Operation failed!!!');
    }
};

export const getAbsolutePath = (targetPath, currentDir) => {
    return path.isAbsolute(targetPath) ? targetPath : path.resolve(currentDir, targetPath);
};
