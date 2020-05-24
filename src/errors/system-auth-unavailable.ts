import { SystemAuthError } from './base';

const MESSAGE = 'Unable to get response from System Auth';

/**
 * Thrown if **System Auth** will not respond
 */
export class SystemAuthUnavailableError extends SystemAuthError {
  /**
   * Error name
   */
  name = SystemAuthUnavailableError.name;

  /**
   * Request that was failed
   */
  request: any;

  constructor(request?: any) {
    super(MESSAGE);
    Object.setPrototypeOf(this, SystemAuthUnavailableError.prototype);
    this.request = request;
  }
}
