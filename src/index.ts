import { createInterface } from "readline";
import { DirectoryScanner } from "./DirectoryScanner";
import { ScannerError } from "./ScannerError";

async function askForPath(): Promise<string> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question("Enter a folder path to scan: ", (answer: string) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function main(): Promise<void> {
  console.log("Recursive Directory Scanner");
  console.log("===========================");
  console.log("");

  const pathFromArgs = process.argv[2];
  const folderPath = pathFromArgs ?? (await askForPath());

  const scanner = new DirectoryScanner();

  try {
    const tree = await scanner.scan(folderPath);
    console.log("");
    console.log(`Directory tree for: ${tree.fullPath}`);
    console.log("");
    scanner.printTree(tree);
    scanner.printSummary(tree);
  } catch (error) {
    if (error instanceof ScannerError) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error("An unexpected error occurred while scanning the folder.");
      console.error(error);
    }
    process.exitCode = 1;
  }
}

main();
