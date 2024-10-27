import { describe, expect, test } from "@jest/globals";
import FileService from "../services/file-service.js";
import DirectoryCreateError from "../errors/directory-create-error.js";
import DirectoryMoveError from "../errors/directory-move-error.js";
import DirectoryDeleteError from "../errors/directory-delete-error.js";

describe("the file service, CREATE command", () => {
  const fileService = new FileService();

  test("can create simple child directory", () => {
    const childDirectoryName = "child_dir";
    const rootDir = {};
    fileService.create(rootDir, childDirectoryName);
    expect(rootDir[childDirectoryName]).toBeDefined();
  });

  test("can create 2 level child directory when none exist", () => {
    const secondLevelDirName = "2nd_dir";
    const thirdLevelDirName = "3rd_dir";
    const directoryPathToBeCreated = `${secondLevelDirName}/${thirdLevelDirName}`;
    const rootDir = {};

    fileService.create(rootDir, directoryPathToBeCreated);
    expect(rootDir[secondLevelDirName]).toBeDefined();
    expect(rootDir[secondLevelDirName][thirdLevelDirName]).toBeDefined();
  });

  test("can create 2 level child directory when mid directory exist", () => {
    const secondLevelDirName = "2nd_dir";
    const thirdLevelDirName = "3rd_dir";
    const directoryPathToBeCreated = `${secondLevelDirName}/${thirdLevelDirName}`;
    const rootDir = {
      secondLevelDirName: {},
    };

    fileService.create(rootDir, directoryPathToBeCreated);
    expect(rootDir[secondLevelDirName][thirdLevelDirName]).toBeDefined();
  });

  test("passing undefined root directory for create command result in error", () => {
    function passUndefinedRootDirToCreateFunction() {
      fileService.create(undefined, "child_dir");
    }

    expect(passUndefinedRootDirToCreateFunction).toThrow(
      new DirectoryCreateError("root directory is undefined")
    );
  });

  test("passing undefined for new directory name for create command result in error", () => {
    const rootDir = {};
    function passUndefinedRootDirToCreateFunction() {
      fileService.create(rootDir, undefined);
    }

    expect(passUndefinedRootDirToCreateFunction).toThrow(
      new DirectoryCreateError("directory path to be created is undefined")
    );
  });
});

describe("the file service, MOVE command", () => {
  const fileService = new FileService();

  test("can move existing child directory between sub directories", () => {
    // here we moving 'deepDir' from 'subDir2' to 'subDir1'
    const subDir1 = "subDir1";
    const subDir2 = "subDir2";
    const deepDir = "deepDir";
    const rootDir = {
      [subDir1]: {},
      [subDir2]: {
        [deepDir]: {},
      },
    };
    const from = `${subDir2}/${deepDir}`;
    const to = `${subDir1}`;
    fileService.move(rootDir, from, to);
    expect(rootDir[subDir1][deepDir]).toBeDefined();
    expect(rootDir[subDir2][deepDir]).toBeUndefined();
  });

  test("can move existing child directory tree with all its children", () => {
    // here we moving 'dirToMove' with all its children from 'rootDir' to 'targetDir'
    const targetDir = "targetDir";
    const dirToMove = "dirToMove";
    const deepDir = "deepDir";
    const evenDeeperDir = "evenDeeperDir";
    const rootDir = {
      [targetDir]: {},
      [dirToMove]: {
        [deepDir]: {
          [evenDeeperDir]: {},
        },
      },
    };
    const from = `${dirToMove}`;
    const to = `${targetDir}`;
    fileService.move(rootDir, from, to);

    // expecting to find 'dirToMove' and all it's children to be under 'dirToMove'
    expect(rootDir[targetDir][dirToMove]).toBeDefined();
    expect(rootDir[targetDir][dirToMove][deepDir]).toBeDefined();
    expect(rootDir[targetDir][dirToMove][deepDir][evenDeeperDir]).toBeDefined();

    // expecting undefined as we move it to be under 'dirToMove'
    expect(rootDir[dirToMove]).toBeUndefined();
  });

  test("passing undefined 'from' for move command result in error", () => {
    const rootDir = {
      dir1: {},
      dir2: {},
    };
    function passUndefinedFromToMoveFunction() {
      const to = "dir2";
      fileService.move(rootDir, undefined, to);
    }

    expect(passUndefinedFromToMoveFunction).toThrow(
      new DirectoryMoveError("'from' parameter is undefined")
    );
  });

  test("passing undefined 'to' for move command result in error", () => {
    const rootDir = {
      dir1: {},
      dir2: {},
    };
    function passUndefinedFromToMoveFunction() {
      const from = "dir1";
      fileService.move(rootDir, from, undefined);
    }

    expect(passUndefinedFromToMoveFunction).toThrow(
      new DirectoryMoveError("'to' parameter is undefined")
    );
  });

  test("passing undefined 'rootDir' for move command result in error", () => {
    function passUndefinedFromToMoveFunction() {
      const from = "dir1";
      const to = "dir2";
      fileService.move(undefined, from, to);
    }

    expect(passUndefinedFromToMoveFunction).toThrow(
      new DirectoryMoveError("'rootDir' parameter is undefined")
    );
  });

  test("passing non-exist 'from' path for move command result in error", () => {
    const rootDir = {
      dir1: {},
      dir2: {},
    };

    const from = "dir3"; // non-exist
    const to = "dir2";

    function passUndefinedFromToMoveFunction() {
      fileService.move(rootDir, from, to);
    }

    expect(passUndefinedFromToMoveFunction).toThrow(
      new DirectoryMoveError(`move: source directory ${from} does not exist`)
    );
  });

  test("passing non-exist 'to' path for move command result in error", () => {
    const rootDir = {
      dir1: {},
      dir2: {},
    };

    const from = "dir2";
    const to = "dir3"; // non-exist

    function passUndefinedFromToMoveFunction() {
      fileService.move(rootDir, from, to);
    }

    expect(passUndefinedFromToMoveFunction).toThrow(
      new DirectoryMoveError(`move: target directory ${to} does not exist`)
    );
  });
});

describe("the file service, DELETE command", () => {
  const fileService = new FileService();

  test("can delete existing child directory", () => {
    // here we delete 'deepDir' from 'subDir2'
    const subDir1 = "subDir1";
    const subDir2 = "subDir2";
    const deepDir = "deepDir";
    const rootDir = {
      [subDir1]: {},
      [subDir2]: {
        [deepDir]: {},
      },
    };
    const pathToDelete = `${subDir2}/${deepDir}`;
    fileService.delete(rootDir, pathToDelete);

    // expected not be there after deletion
    expect(rootDir[subDir2][deepDir]).toBeUndefined();

    // expected other directories to stay
    expect(rootDir[subDir1]).toBeDefined();
  });

  test("passing non-exist path for delete command result in error", () => {
    const rootDir = {
      dir1: {},
      dir2: {},
    };

    const pathToDelete = "dir3"; // non exist

    function passNonExistPathToDeleteFunction() {
      fileService.delete(rootDir, pathToDelete);
    }

    expect(passNonExistPathToDeleteFunction).toThrow(
      new DirectoryDeleteError(
        `Cannot delete ${pathToDelete} - ${pathToDelete} does not exist`
      )
    );
  });

  test("passing partial non-exist path for delete command result in error", () => {
    const rootDir = {
      dir1: {},
      dir2: {
        child1: {},
      },
    };

    const existingPath = "dir2";
    const noneExistingPath = "child2";
    const pathToDelete = `${existingPath}/${noneExistingPath}`; // here path partially exist

    function passNonExistPathToDeleteFunction() {
      fileService.delete(rootDir, pathToDelete);
    }

    expect(passNonExistPathToDeleteFunction).toThrow(
      new DirectoryDeleteError(
        `Cannot delete ${pathToDelete} - ${noneExistingPath} does not exist`
      )
    );
  });

  test("passing undefined path for delete command result in error", () => {
    const rootDir = {};
    function passNonExistPathToDeleteFunction() {
      fileService.delete(rootDir, undefined);
    }

    expect(passNonExistPathToDeleteFunction).toThrow(
      new DirectoryDeleteError("'path' parameter is undefined")
    );
  });

  test("passing undefined rootDir for delete command result in error", () => {
    function passNonExistPathToDeleteFunction() {
      fileService.delete(undefined, "somePath");
    }

    expect(passNonExistPathToDeleteFunction).toThrow(
      new DirectoryDeleteError("'rootDir' parameter is undefined")
    );
  });
});
