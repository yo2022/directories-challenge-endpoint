export default class CommandNotSupportedError extends Error {
  constructor(command, ...params) {
    super(params);
    this.command = command;
    this.message = `command '${command}' is not supported`;
  }
}
