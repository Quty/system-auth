export interface SystemAuthClientParams {
  /**
   * Base URL of **System Auth**. Protocol (`http` or `https`) is required.
   * @example 'http://dev-lit:48001'
   * @default 'http://system-auth'
   */
  baseUrl?: string;

  /**
   * **System Auth** client name.
   */
  client: string;

  /**
   * **System Auth** client secret.
   */
  secret: string;
}
