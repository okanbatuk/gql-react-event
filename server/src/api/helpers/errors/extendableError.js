export default class ExtendableError extends Error {
  constructor({ message, errors, status }) {
    super(message);
    this.name = this.constructor.name;
    this.errors = errors;
    this.status = status;
  }
}
