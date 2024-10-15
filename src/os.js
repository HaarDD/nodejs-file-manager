import os from 'os';

const handleOSCommand = (command) => {
  switch (command) {
    case '--EOL':
      console.log(JSON.stringify(os.EOL));
      break;
    case '--cpus':
      const cpus = os.cpus();
      cpus.forEach((cpu, i) => {
        console.log(`CPU ${i + 1}: ${cpu.model}, ${cpu.speed / 1000} GHz`);
      });
      console.log(`Total CPUs: ${cpus.length}`);
      break;
    case '--homedir':
      console.log(os.homedir());
      break;
    case '--username':
      console.log(os.userInfo().username);
      break;
    case '--architecture':
      console.log(os.arch());
      break;
    default:
      console.error('Invalid OS command');
  }
};

export const getEOL = () => handleOSCommand('--EOL');
export const getCPUs = () => handleOSCommand('--cpus');
export const getHomeDir = () => handleOSCommand('--homedir');
export const getUsername = () => handleOSCommand('--username');
export const getArch = () => handleOSCommand('--architecture');