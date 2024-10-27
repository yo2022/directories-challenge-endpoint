"use strict";

import FileService from "./services/file-service.js";
import CliService from "./services/cli-service.js";
import SupportedCommands from "./objects/supported-commands.js";
import { printObjectHierarchy } from "./utils/object-utils.js";
import CommandNotSupportedError from "./errors/command-not-supported-error.js";
import CommandArgumentsMismatchError from "./errors/command-arguments-mismatch-error.js";

class App {
  static expectedParametersForCreateCommand = 1;
  static expectedParametersForMoveCommand = 2;
  static expectedParametersForDeleteCommand = 1;
  static expectedParametersForListCommand = 0;

  cliService = new CliService();
  fileService = new FileService();
  rootDir = {};


  ////////// cli ///////////

  async startCLI() {
    try {
      await this.cliService.start(this.onLineEnteredHandler);
    } catch (e) {
      console.error(e.message);
    }
  }

  processInput = (lineInput) => {
    try {
      const splittedEntriesBySpace = lineInput.split(" ");
      const command = splittedEntriesBySpace.shift();

      switch (command.toUpperCase()) {
        case SupportedCommands.CREATE:
          this.handleCreateCommand(splittedEntriesBySpace);
          break;
        case SupportedCommands.MOVE:
          this.handleMoveCommand(splittedEntriesBySpace);
          break;
        case SupportedCommands.DELETE:
          this.handleDeleteCommand(splittedEntriesBySpace);
          break;
        case SupportedCommands.LIST:
          this.handleListCommand(splittedEntriesBySpace);
          break;
        default:
          throw new CommandNotSupportedError(command);
      }
    } catch (e) {
      console.error(e.message);
    }
  };

  ////////// command handlers ///////////

  handleCreateCommand = (splittedEntriesBySpace) => {
    try {
      if (
        splittedEntriesBySpace.length != App.expectedParametersForCreateCommand
      ) {
        throw new CommandArgumentsMismatchError(
          SupportedCommands.CREATE,
          App.expectedParametersForCreateCommand,
          splittedEntriesBySpace.length
        );
      }
      const path = splittedEntriesBySpace[0];
      this.fileService.create(this.rootDir, path);
    } catch (e) {
      console.error(e.message);
    }
  };

  handleMoveCommand = (splittedEntriesBySpace) => {
    try {
      if (
        splittedEntriesBySpace.length != App.expectedParametersForMoveCommand
      ) {
        throw new CommandArgumentsMismatchError(
          SupportedCommands.MOVE,
          App.expectedParametersForMoveCommand,
          splittedEntriesBySpace.length
        );
      }
      const from = splittedEntriesBySpace[0];
      const to = splittedEntriesBySpace[1];
      this.fileService.move(this.rootDir, from, to);
    } catch (e) {
      console.error(e.message);
    }
  };

  handleDeleteCommand = (splittedEntriesBySpace) => {
    try {
      if (
        splittedEntriesBySpace.length != App.expectedParametersForDeleteCommand
      ) {
        throw new CommandArgumentsMismatchError(
          SupportedCommands.DELETE,
          App.expectedParametersForDeleteCommand,
          splittedEntriesBySpace.length
        );
      }
      const path = splittedEntriesBySpace[0];
      this.fileService.delete(this.rootDir, path);
    } catch (e) {
      console.error(e.message);
    }
  };

  handleListCommand = (splittedEntriesBySpace) => {
    try {
      if (
        splittedEntriesBySpace.length != App.expectedParametersForListCommand
      ) {
        throw new CommandArgumentsMismatchError(
          SupportedCommands.LIST,
          App.expectedParametersForListCommand,
          splittedEntriesBySpace.length
        );
      }
      printObjectHierarchy(this.rootDir);
    } catch (e) {
      console.error(e.message);
    }
  };

  /////////// event handlers //////////////

  onLineEnteredHandler = (lineInput) => {
    if (lineInput === "quit") {
      this.cliService.stop();
    } else {
      this.processInput(lineInput);
    }
  };
}

const app = new App();
app.startCLI();


