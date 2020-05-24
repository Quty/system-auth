import axios from 'axios';

import {
  SystemAuthClient,
  SystemAuthError,
  InvalidCredentialsError,
  UnexpectedResponseError,
  SystemAuthUnavailableError,
} from '../src';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
mockedAxios.create = jest.fn(() => mockedAxios);

describe('SystemAuthClient', () => {
  describe('constructor', () => {
    it('creates instance with correct parameters', () => {
      const client = new SystemAuthClient({
        client: 'client_name',
        secret: 'client_secret',
      });

      expect(client).toBeDefined();
      expect(client).toBeInstanceOf(SystemAuthClient);
    });

    it('fails without params', () => {
      expect(() => new SystemAuthClient(undefined as any)).toThrow(
        SystemAuthError,
      );
    });

    it('fails without credentials', () => {
      expect(() => new SystemAuthClient({} as any)).toThrow(SystemAuthError);
    });
  });

  describe('getToken', () => {
    it('returns access token', async () => {
      const mockResponse = {
        data: {
          access_token: 'token',
          expires_in: 3599,
        },
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const client = new SystemAuthClient({
        client: 'client_name',
        secret: 'client_secret',
      });

      const token = await client.getToken();

      expect(token).toBeDefined();
      expect(typeof token === 'string').toBeTruthy();
      expect(token).toEqual(mockResponse.data.access_token);
    });

    it('throws InvalidCredentialsError when server responds with 401 status code', async () => {
      const mockError = {
        response: {
          status: 401,
          data: {
            status: 401,
            message: 'Unauthorized',
          },
        },
      };

      mockedAxios.post.mockRejectedValue(mockError);

      let error: any;

      const client = new SystemAuthClient({
        client: 'client_name',
        secret: 'client_secret',
      });

      try {
        await client.getToken();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(InvalidCredentialsError);
      expect((error as InvalidCredentialsError).response).toEqual(
        mockError.response,
      );
    });

    it('throws UnexpectedResponseError when server responds with non 2xx neither 401 status code', async () => {
      const mockError = {
        response: {
          status: 500,
          data: {
            status: 500,
            message: 'Server unavailable',
          },
        },
      };

      mockedAxios.post.mockRejectedValue(mockError);

      const client = new SystemAuthClient({
        client: 'client_name',
        secret: 'client_secret',
      });

      let error: any;

      try {
        await client.getToken();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(UnexpectedResponseError);
      expect(error.response).toEqual(mockError.response);
    });

    it('throws UnexpectedResponseError when server responds with unexpected body', async () => {
      const mockResponse = {
        status: 200,
        data: {
          foo: 'bar',
        },
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const client = new SystemAuthClient({
        client: 'client_name',
        secret: 'client_secret',
      });

      let error: any;

      try {
        await client.getToken();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(UnexpectedResponseError);
    });
  });

  it('throws SystemAuthUnavailableError when server is not responding', async () => {
    const mockError = {
      request: { host: 'http://system-auth' },
    };

    mockedAxios.post.mockRejectedValueOnce(mockError);

    const client = new SystemAuthClient({
      client: 'client_name',
      secret: 'client_secret',
    });

    let error: any;

    try {
      await client.getToken();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error).toBeInstanceOf(SystemAuthUnavailableError);
  });

  it('throws original error if it is not related to communication or validation', async () => {
    const mockError = new Error('Just an error');

    mockedAxios.post.mockRejectedValueOnce(mockError);

    const client = new SystemAuthClient({
      client: 'client_name',
      secret: 'client_secret',
    });

    let error: any;

    try {
      await client.getToken();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error).toBeInstanceOf(Error);
    expect(error).toEqual(mockError);
  });
});
