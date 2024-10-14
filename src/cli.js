import readline from 'readline';
import { homedir } from 'os';
import { handle } from './utils.js';

const username = process.argv.find(arg => arg.startsWith('--username='))?.split('=')[1] || 'Guest';
let currentDirectory = homedir();

const messages = {
  welcome: `\nWelcome to the File Manager, ${username}!`,
  currentDir: '\nYou are currently in ',
  exit: `\nThank you for using File Manager, ${username}, goodbye!`,
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> '
});

function printWelcomeMessage() {
  console.log(messages.welcome);
}

function printCurrentDirectory() {
  console.log(messages.currentDir + currentDirectory);
}

function exit() {
  console.log(messages.exit);
  process.exit(0);
}

function init() {
  printWelcomeMessage();
  printCurrentDirectory();
  rl.prompt();
  
  rl.on('line', (line) => {
    const input = line.trim();
    if (input === '.exit') {
      exit();
    } else {
      handle(input, currentDirectory, rl, (newDir) => {
        if (newDir) {
          currentDirectory = newDir;
          printCurrentDirectory();
        }
        rl.prompt();
      });
    }
  }).on('close', exit);
}

init();