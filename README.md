# File Manager

## Description

Your task is to implement File Manager using Node.js APIs.

The file manager should be able to do the following:

- Work using CLI
- Perform basic file operations (copy, move, delete, rename, etc.)
- Utilize Streams API
- Get information about the host machine operating system
- Perform hash calculations
- Compress and decompress files
  
# Self check
****Total 270*/330 - please read "Some code fixes" block below!****
# Self check: Basic Scope  (180*/240)
- General (16/16)
	- +6 Application accepts username and prints proper message
	- +10 Application exits if user pressed ctrl+c or sent .exit command and proper message is printed
	
- Operations fail (30/30)
	- +20 Attempts to perform an operation on a non-existent file or work on a non-existent path result in the operation fail
    - +10 Operation fail doesn't crash application
	
- Navigation & working directory operations implemented properly (40/40)
    - +10 Go upper from current directory
    - +10 Go to dedicated folder from current directory
    - +20 List all files and folders in current directory
	
- Basic operations with files implemented properly (60/60)
    - +10 Read file and print it's content in console
    - +10 Create empty file
    - +10 Rename file
    - +10 Copy file
    - +10 Move file
    - +10 Delete file
	
- Operating system info (prints following information in console) implemented properly (34/34)
    - +6 Get EOL (default system End-Of-Line)
    - +10 Get host machine CPUs info (overall amount of CPUS plus model and clock rate (in GHz) for each of them)
    - +6 Get home directory
    - +6 Get current *system user name* (Do not confuse with the username that is set when the application starts)
    - +6 Get CPU architecture for which Node.js binary has compiled
	
- Hash calculation implemented properly (0*/20) * - please, check block "some code fixes" below!
    - 0 Calculate hash for file 
	
- Compress and decompress operations (0/40)
    - 0 Compress file (using Brotli algorithm)
    - 0 Decompress file (using Brotli algorithm)

 # Self check: Advanced Scope (90/90)

- 	+30 All operations marked as to be implemented using certain streams should be performed using Streams API

- 	+20 No synchronous Node.js API with asynchronous analogues is used (e.g. not used readFileSync instead of readFile)  
- 	+20 Codebase is written in ESM modules instead of CommonJS
- 	+20 Codebase is separated (at least 7 modules)

# Some code fixes

I would really appreciate it if you could check hash.js with the following changes, if it's not too much trouble for you

Line 4 of hash.js file (add import):

`import { clearLine } from './fs.js'`

Line 33 of the utils.js file (add arguments to the function):

`case 'hash': return calculateHash(rl, args[0], currentDir);`

Unfortunately, in the process of refactoring I completely forgot about changing the arguments. But I can't send commits after the deadline
	
**Anyway, thanks for pointing that out! :)**
