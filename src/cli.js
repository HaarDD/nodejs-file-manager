import readline from 'readline';
import { homedir } from 'os';
import { handle } from './utils.js'


const username = process.argv.find(arg => arg.startsWith('--username='))?.split('=')[1] || 'Guest';

let currentDirectory = homedir();

const messageWelcome = `Welcome to the File Manager, ${username}!`;
const messageCurrentDir = 'You are currently in ';
const messageExit = `Thank you for using File Manager, ${username}, goodbye!`;

console.log(messageWelcome);
console.log(messageCurrentDir + currentDirectory);



const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> '
});

rl.prompt();

rl.on('line', (line) => {
  const input = line.trim();
  if (input === '.exit') {
    exit();
  } else {
    handle(input, currentDirectory, rl, (newDir) => {
      if (newDir) {
        currentDirectory = newDir;
        console.log(messageCurrentDir + currentDirectory);
      }
      rl.prompt();
    });
  }
}).on('close', () => {
  exit();
});

function exit() {
  console.log(messageExit);
  process.exit(0);
}