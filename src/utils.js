import { up, ls, cd, cat, add, rn, cp, mv, rm, clearLine } from './fs.js';
import { getEOL, getCPUs, getHomeDir, getUsername, getArch } from './os.js';
import { calculateHash } from './hash.js';
import { compress, decompress } from './compress.js';

const handleError = (rl) => {
  console.error('Invalid input');
  clearLine(rl);
};

export const handle = (input, currentDir, rl, callback) => {
  const [command, ...args] = input.split(' ');

  switch (command) {
    case 'up': return up(rl, currentDir, callback);
    case 'cd': return cd(rl, args[0], currentDir, callback);
    case 'ls': return ls(rl, currentDir);
    case 'cat': return cat(rl, args[0], currentDir);
    case 'add': return add(rl, args[0], currentDir, callback);
    case 'rn': return rn(rl, args[0], args[1], currentDir, callback);
    case 'cp': return cp(rl, args[0], args[1], currentDir, callback);
    case 'mv': return mv(rl, args[0], args[1], currentDir, callback);
    case 'rm': return rm(rl, args[0], currentDir, callback);
    case 'os':
      switch (args[0]) {
        case '--EOL': return getEOL();
        case '--cpus': return getCPUs();
        case '--homedir': return getHomeDir();
        case '--username': return getUsername();
        case '--architecture': return getArch();
        default: return handleError(rl);
      }
    case 'hash': return calculateHash(args[0]);
    case 'compress': return compress(args[0], args[1]);
    case 'decompress': return decompress(args[0], args[1]);
    default: return handleError(rl);
  }
};