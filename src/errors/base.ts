export class SystemAuthError extends Error {
  name = SystemAuthError.name;

  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, SystemAuthError.prototype);
  }
}
