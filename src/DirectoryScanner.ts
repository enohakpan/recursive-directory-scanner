import { Dirent } from "fs";
import { readdir, stat } from "fs/promises";
import { basename, join } from "path";
import { FileNode } from "./FileNode";
import { InvalidDirectoryError, PermissionDeniedError } from "./ScannerError";

/**
 * Recursively scans a directory tree using asynchronous file-system calls.
 */
export class DirectoryScanner {
  private static readonly skippedFolders: string[] = [".git", "node_modules", "dist"];

  /**
   * Validates the path, then starts the recursive scan.
   */
  async scan(rootPath: string): Promise<FileNode> {
    const trimmedPath = rootPath.trim();

    if (!trimmedPath) {
      throw new InvalidDirectoryError(trimmedPath);
    }

    try {
      const info = await stat(trimmedPath);

      if (!info.isDirectory()) {
        throw new InvalidDirectoryError(trimmedPath);
      }
    } catch (error) {
      this.rethrowAccessError(error, trimmedPath);
    }

    return this.scanRecursive(trimmedPath);
  }

  /**
   * Recursively reads a folder and all of its subfolders.
   * Each call handles one directory, then calls itself for every subdirectory.
   */
  private async scanRecursive(dirPath: string): Promise<FileNode> {
    const node = new FileNode(basename(dirPath) || dirPath, dirPath, true);

    let entries: Dirent[];
    try {
      entries = await readdir(dirPath, { withFileTypes: true });
    } catch (error) {
      this.rethrowAccessError(error, dirPath);
    }

    const sortedEntries = entries.sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
    );

    for (const entry of sortedEntries) {
      const entryPath = join(dirPath, entry.name);

      if (entry.isDirectory()) {
        if (DirectoryScanner.skippedFolders.includes(entry.name)) {
          continue;
        }

        try {
          const childDirectory = await this.scanRecursive(entryPath);
          node.addChild(childDirectory);
        } catch (error) {
          if (error instanceof PermissionDeniedError) {
            const skipped = new FileNode(`${entry.name} [access denied]`, entryPath, true);
            node.addChild(skipped);
          } else {
            throw error;
          }
        }
      } else if (entry.isFile()) {
        const fileInfo = await stat(entryPath);
        node.addChild(new FileNode(entry.name, entryPath, false, fileInfo.size));
      }
    }

    return node;
  }

  /**
   * Prints the scanned tree to the terminal using console.log().
   */
  printTree(node: FileNode, prefix: string = "", isLast: boolean = true, isRoot: boolean = true): void {
    const connector = isRoot ? "" : isLast ? "└── " : "├── ";
    const label = node.isDirectory ? `${node.name}/` : node.name;
    console.log(`${prefix}${connector}${label}`);

    const childPrefix = isRoot ? "" : prefix + (isLast ? "    " : "│   ");
    const lastIndex = node.children.length - 1;

    for (let i = 0; i < node.children.length; i++) {
      this.printTree(node.children[i], childPrefix, i === lastIndex, false);
    }
  }

  printSummary(node: FileNode): void {
    const directories = node.getDirectoryCount();
    const files = node.getFileCount();
    console.log("");
    console.log(`Scan complete: ${directories} folder(s), ${files} file(s).`);
  }

  private rethrowAccessError(error: unknown, dirPath: string): never {
    if (error instanceof InvalidDirectoryError || error instanceof PermissionDeniedError) {
      throw error;
    }

    const code = (error as NodeJS.ErrnoException).code;

    if (code === "ENOENT") {
      throw new InvalidDirectoryError(dirPath);
    }

    if (code === "EACCES" || code === "EPERM") {
      throw new PermissionDeniedError(dirPath);
    }

    throw error;
  }
}
