import { up, ls, cd, cat, add, rn, cp, mv, rm, clearLine } from './fs.js';


export const handle = (input, currentDir, rl, callback) => {
  const [command, ...args] = input.split(' ');

  switch (command) {
    case 'up':
      up(rl, currentDir, callback);
      break;
    case 'cd':
      cd(rl, args[0], currentDir, callback);
      break;
    case 'ls':
      ls(rl, currentDir);
      break;
    case 'cat':
      cat(rl, args[0], currentDir);
      break;
    case 'add':
      add(rl, args[0], currentDir, callback);
      break;
    case 'rn':
      rn(rl, args[0], args[1], currentDir, callback);
      break;
    case 'cp':
      cp(rl, args[0], args[1], currentDir, callback);
      break;
    case 'mv':
      mv(rl, args[0], args[1], currentDir, callback);
      break;
    case 'rm':
      rm(rl, args[0], currentDir, callback);
      break;

    default:
      console.error('Invalid input');
      clearLine(rl);
  }


};



