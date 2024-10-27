export default class CommandArgumentsMismatchError extends Error {
  constructor(command, expectedArgumentsCount, foundArgumentsCount, ...params) {
    super(params);
    this.command = command;
    this.expectedArgumentsCount = expectedArgumentsCount;
    this.foundArgumentsCount = foundArgumentsCount;
    this.message = `'${command}' command expect ${expectedArgumentsCount} argument${
      expectedArgumentsCount > 1 ? "s" : ""
    } after command name. Instead found ${foundArgumentsCount}`;
  }
}
