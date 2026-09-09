/**
 * Represents a file or directory in the scanned tree.
 * Directories store child nodes in a list (array).
 */
export class FileNode {
  name: string;
  fullPath: string;
  isDirectory: boolean;
  children: FileNode[];
  size: number;

  constructor(name: string, fullPath: string, isDirectory: boolean, size: number = 0) {
    this.name = name;
    this.fullPath = fullPath;
    this.isDirectory = isDirectory;
    this.children = [];
    this.size = size;
  }

  addChild(node: FileNode): void {
    this.children.push(node);
  }

  getFileCount(): number {
    if (!this.isDirectory) {
      return 1;
    }

    let count = 0;
    for (const child of this.children) {
      count += child.getFileCount();
    }
    return count;
  }

  getDirectoryCount(): number {
    if (!this.isDirectory) {
      return 0;
    }

    let count = 1;
    for (const child of this.children) {
      count += child.getDirectoryCount();
    }
    return count;
  }
}
