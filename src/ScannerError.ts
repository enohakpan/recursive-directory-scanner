/**
 * Base class for scanner-related exceptions.
 */
export class ScannerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ScannerError";
  }
}

/**
 * Thrown when the user enters a path that does not exist
 * or is not a directory.
 */
export class InvalidDirectoryError extends ScannerError {
  constructor(dirPath: string) {
    super(`Invalid directory: "${dirPath}" does not exist or is not a folder.`);
    this.name = "InvalidDirectoryError";
  }
}

/**
 * Thrown when the program does not have permission to read a folder.
 */
export class PermissionDeniedError extends ScannerError {
  constructor(dirPath: string) {
    super(`Permission denied: cannot access "${dirPath}".`);
    this.name = "PermissionDeniedError";
  }
}
