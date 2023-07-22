import ExtendableError from "./extendableError.js";

/*
 * Error represents
 * @extends {ExtendableError}
 *
 */

export default class APIError extends ExtendableError {
  constructor({ message, errors, status }) {
    super({ message, errors, status });
  }
}
