# Overview

I built this Recursive Directory Scanner to learn TypeScript by writing a real command-line tool instead of isolated syntax examples. The program asks for a folder path (or accepts one as a command-line argument), walks every subdirectory, and prints the file structure in the terminal along with a count of folders and files.

The scanner is written so I could practice TypeScript language syntax in one place:

- **Terminal output:** `console.log()` prints the directory tree and the scan summary.
- **Recursion:** `scanRecursive()` calls itself for every subdirectory until the tree is complete. `printTree()` is also recursive so nested folders indent correctly.
- **Classes:** `DirectoryScanner` runs the scan, `FileNode` represents each file or folder, and custom error classes describe failures.
- **Lists:** each directory stores its children in a typed array (`FileNode[]`). A string array holds folder names to skip (`.git`, `node_modules`, `dist`).
- **Asynchronous functions:** `async`/`await` with Node’s `fs/promises` API reads folders without blocking the rest of the program.
- **Exception handling:** invalid paths throw `InvalidDirectoryError`, permission problems throw `PermissionDeniedError`, and `main()` catches those errors so the program can print a clear message instead of crashing.

I also wanted to see how TypeScript’s type checker works in the editor, and how `tsc` converts the same code into JavaScript that Node.js can run.

[Software Demo Video](https://youtu.be/REPLACE_WITH_YOUR_VIDEO)

# Development Environment

I wrote and ran the project in Visual Studio Code. TypeScript is a strongly typed language that builds on JavaScript. Extra type syntax gives tighter editor integration, so many mistakes show up before the program runs. The TypeScript compiler then converts the code to JavaScript, which Node.js executes.

Node.js is the runtime. The scanner uses built-in modules only: `fs/promises` for asynchronous folder reads, `path` for joining paths, and `readline` for prompting in the terminal.

Libraries and tools:

- **TypeScript** — language and compiler (`tsc`), set up from the [TypeScript download guide](https://www.typescriptlang.org/download/)
- **Node.js** — runtime for the compiled JavaScript
- **@types/node** — TypeScript type definitions for Node.js APIs
- **npm** — installs dependencies and runs the `build`, `start`, and `dev` scripts in `package.json`

To run the project: `npm install`, then `npm run build`, then `npm start`. Pass a folder as an argument with `npm start -- "C:\path\to\folder"`, or use `npm run dev` to compile and run in one step.

# Useful Websites

- [TypeScript Official Website](https://www.typescriptlang.org/)
- [TypeScript Download and Setup](https://www.typescriptlang.org/download/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Wikipedia: TypeScript](https://en.wikipedia.org/wiki/TypeScript)
- [Node.js File System Promises API](https://nodejs.org/api/fs.html#promises-api)
- [Node.js Path Module](https://nodejs.org/api/path.html)
- [Node.js Readline](https://nodejs.org/api/readline.html)
- [Net Ninja TypeScript Tutorial](https://youtu.be/2pZmKW9-I_k?si=kC3w2CnzjI2S2Q2B)

# Future Work

- Show file sizes in the tree. Each `FileNode` already stores size, but the printed output does not display it yet.
- Let the user choose which folders to skip instead of hard-coding `.git`, `node_modules`, and `dist`.
- Add a maximum depth option so very large trees stay readable.
- Export the scan result as JSON for use in other tools.
- Handle symbolic links so the scanner does not follow a cycle or miss linked folders.
- Add unit tests for path validation, permission errors, and file/folder counts.
