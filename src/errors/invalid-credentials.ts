import { SystemAuthError } from './base';

const MESSAGE = 'Invalid credentials';

/**
 * Thrown if **System Auth** respond with 401 status code
 */
export class InvalidCredentialsError extends SystemAuthError {
  /**
   * Error name
   */
  name = InvalidCredentialsError.name;

  /**
   * Actual server response
   */
  response: any;

  constructor(response: any) {
    super(MESSAGE);
    Object.setPrototypeOf(this, InvalidCredentialsError.prototype);
    this.response = response;
  }
}
