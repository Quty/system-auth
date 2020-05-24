import { SystemAuthError } from './base';

const MESSAGE = 'Unexpected response from System Auth';

/**
 * Thrown if **System Auth** response has unexpected data
 * (doesn't contains `access_token` or `expires_in` fields)
 */
export class UnexpectedResponseError extends SystemAuthError {
  /**
   * Error name
   */
  name = UnexpectedResponseError.name;

  /**
   * Actual server response
   */
  response: any;

  constructor(response?: any) {
    super(MESSAGE);
    Object.setPrototypeOf(this, UnexpectedResponseError.prototype);
    this.response = response;
  }
}
