export default class DirectoryNotFoundError extends Error {
  constructor(dirName, ...params) {
    super(params);
    this.dirName = dirName;
    this.message = `directory '${dirName}' not found`;
  }
}
