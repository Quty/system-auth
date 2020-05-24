import { stringify } from 'querystring';

import axios, { AxiosInstance, AxiosError } from 'axios';
import { ValidationError } from 'myzod';

import {
  DEFAULT_BASE_URL,
  CREATE_TOKEN_PATH,
  GRANT_TYPE_PARAM_NAME,
} from './constants';
import { GrantType } from './enums';
import { SystemAuthClientParams, GetTokenOptions } from './interfaces';
import { createTokenResponseSchema } from './schemas';
import {
  SystemAuthError,
  UnexpectedResponseError,
  InvalidCredentialsError,
  SystemAuthUnavailableError,
} from './errors';

export class SystemAuthClient {
  private readonly axiosInstance: AxiosInstance;
  private token?: string;
  private tokenValidUntil?: Date;

  constructor(params: SystemAuthClientParams) {
    if (!params || typeof params !== 'object') {
      throw new SystemAuthError('params must be an object');
    }

    if (!params.client || !params.secret) {
      throw new SystemAuthError('Credentials are required');
    }

    const {
      baseUrl: baseURL = DEFAULT_BASE_URL,
      client: username,
      secret: password,
    } = params;

    this.axiosInstance = axios.create({
      baseURL,
      auth: { username, password },
    });
  }

  /**
   * Get valid token
   */
  async getToken(options: GetTokenOptions = {}) {
    const { forceUpdateToken = false } = options;

    if (
      forceUpdateToken ||
      !this.token ||
      !this.tokenValidUntil ||
      this.tokenValidUntil < new Date()
    ) {
      await this.createToken();
    }

    if (!this.token) {
      throw new SystemAuthError('Token unavailable');
    }

    return this.token;
  }

  // Private methods

  /**
   * Create new token and save it to instance properties
   */
  private async createToken() {
    const requestParams = {
      [GRANT_TYPE_PARAM_NAME]: GrantType.CLIENT_CREDENTIALS,
    };
    const url = `${CREATE_TOKEN_PATH}?${stringify(requestParams)}`;

    try {
      const response = await this.axiosInstance.post(url);
      const responseData = createTokenResponseSchema.parse(response.data, {
        allowUnknown: true,
      });

      this.token = responseData.access_token;
      this.tokenValidUntil = new Date(
        Date.now() + responseData.expires_in * 1000,
      );
    } catch (err) {
      if (err instanceof ValidationError) {
        throw new UnexpectedResponseError();
      }

      const axiosErr = err as AxiosError;

      if (axiosErr.response?.status === 401) {
        throw new InvalidCredentialsError(axiosErr.response);
      }

      if (axiosErr.response) {
        throw new UnexpectedResponseError(axiosErr.response);
      }

      if (axiosErr.request) {
        throw new SystemAuthUnavailableError(axiosErr.request);
      }

      throw err;
    }
  }
}
