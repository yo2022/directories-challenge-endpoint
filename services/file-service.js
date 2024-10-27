import DirectoryNotFoundError from "../errors/directory-not-found-error.js";
import DirectoryDeleteError from "../errors/directory-delete-error.js";
import DirectoryMoveError from "../errors/directory-move-error.js";
import DirectoryCreateError from "../errors/directory-create-error.js";

const pathHeirarchySeparator = "/";

class FileService {
  _getDirectoryFromPathHeirarchy = (rootDir, pathHeirarchy) => {
    let currentDir = rootDir;
    for (let directoryName of pathHeirarchy) {
      const directoryNotExist = !currentDir[directoryName];
      if (directoryNotExist) {
        throw new DirectoryNotFoundError(directoryName);
      }
      currentDir = currentDir[directoryName];
    }
    return currentDir;
  };

  create(rootDir, path) {
    if (!rootDir) {
      throw new DirectoryCreateError("root directory is undefined");
    }
    if (!path) {
      throw new DirectoryCreateError(
        "directory path to be created is undefined"
      );
    }
    const pathHeirarchy = path.split(pathHeirarchySeparator);
    let currentDir = rootDir;
    for (let directoryName of pathHeirarchy) {
      const directoryAlreadyExist = directoryName in currentDir;
      if (!directoryAlreadyExist) {
        const newDirectory = {};
        currentDir[directoryName] = newDirectory;
      }
      currentDir = currentDir[directoryName];
    }
  }

  move(rootDir, from, to) {
    let sourceDir;
    let targetDir;
    let directoryNameToMove;

    if (!rootDir) {
      throw new DirectoryMoveError("'rootDir' parameter is undefined");
    }
    if (!from) {
      throw new DirectoryMoveError("'from' parameter is undefined");
    }
    if (!to) {
      throw new DirectoryMoveError("'to' parameter is undefined");
    }

    // get source information
    try {
      const sourcePathHeirarchy = from.split(pathHeirarchySeparator);
      directoryNameToMove = sourcePathHeirarchy.pop();
      sourceDir = this._getDirectoryFromPathHeirarchy(
        rootDir,
        sourcePathHeirarchy
      );
      const sourceDirectoryNotExist = !sourceDir[directoryNameToMove];
      if (sourceDirectoryNotExist) {
        throw new DirectoryNotFoundError(directoryNameToMove);
      }
    } catch (e) {
      if (e instanceof DirectoryNotFoundError) {
        const errorMessage = `move: source directory ${e.dirName} does not exist`;
        throw new DirectoryMoveError(errorMessage);
      } else {
        throw e;
      }
    }

    // get target information
    try {
      const targetPathHeirarchy = to.split(pathHeirarchySeparator);
      targetDir = this._getDirectoryFromPathHeirarchy(
        rootDir,
        targetPathHeirarchy
      );
    } catch (e) {
      if (e instanceof DirectoryNotFoundError) {
        const errorMessage = `move: target directory ${e.dirName} does not exist`;
        throw new DirectoryMoveError(errorMessage);
      } else {
        throw e;
      }
    }

    // perform move
    targetDir[directoryNameToMove] = sourceDir[directoryNameToMove];
    delete sourceDir[directoryNameToMove];
  }

  delete(rootDir, path) {
    if(!rootDir){
        throw new DirectoryDeleteError("'rootDir' parameter is undefined");
    }
    if (!path) {
      throw new DirectoryDeleteError("'path' parameter is undefined");
    }
    try {
      const deletePathHeirarchy = path.split(pathHeirarchySeparator);
      const directoryNameToDelete = deletePathHeirarchy.pop();
      const sourceDir = this._getDirectoryFromPathHeirarchy(
        rootDir,
        deletePathHeirarchy
      );
      const directoryNotExist = !sourceDir[directoryNameToDelete];
      if (directoryNotExist) {
        const errorMessage = `Cannot delete ${path} - ${directoryNameToDelete} does not exist`;
        throw new DirectoryDeleteError(errorMessage);
      }
      delete sourceDir[directoryNameToDelete];
    } catch (e) {
      if (e instanceof DirectoryNotFoundError) {
        const errorMessage = `Cannot delete ${path} - ${e.dirName} does not exist`;
        throw new DirectoryDeleteError(errorMessage);
      } else {
        throw e;
      }
    }
  }
}

export default FileService;
