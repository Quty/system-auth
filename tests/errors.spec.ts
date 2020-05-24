import {
  SystemAuthError,
  InvalidCredentialsError,
  UnexpectedResponseError,
  SystemAuthUnavailableError,
} from '../src/errors';

describe('SystemAuthError', () => {
  const message = 'mock message';
  let error: SystemAuthError;

  beforeAll(() => {
    error = new SystemAuthError(message);
  });

  it('constructor creates instance of error', () => {
    expect(error).toBeDefined();
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(SystemAuthError);
  });

  it('contains proper message', () => {
    expect(error.message).toBeDefined();
    expect(error.message).toEqual(message);
  });
});

describe('InvalidCredentialsError', () => {
  const mockResponse = {
    status: 401,
    message: 'Unauthorized',
  };

  let error: InvalidCredentialsError;

  beforeAll(() => {
    error = new InvalidCredentialsError(mockResponse);
  });

  it('constructor creates instance of error', () => {
    expect(error).toBeDefined();
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(SystemAuthError);
    expect(error).toBeInstanceOf(InvalidCredentialsError);
  });

  it('contains response body', () => {
    expect(error.response).toBeDefined();
    expect(error.response).toEqual(mockResponse);
  });

  it('contains proper message', () => {
    expect(error.message).toBeDefined();
    expect(error.message).toEqual('Invalid credentials');
  });
});

describe('UnexpectedResponseError', () => {
  const mockResponse = {
    foo: 'bar',
  };

  let error: UnexpectedResponseError;

  beforeAll(() => {
    error = new UnexpectedResponseError(mockResponse);
  });

  it('constructor creates instance of error', () => {
    expect(error).toBeDefined();
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(SystemAuthError);
    expect(error).toBeInstanceOf(UnexpectedResponseError);
  });

  it('contains response body', () => {
    expect(error.response).toBeDefined();
    expect(error.response).toEqual(mockResponse);
  });

  it('contains proper message', () => {
    expect(error.message).toBeDefined();
    expect(error.message).toEqual('Unexpected response from System Auth');
  });
});

describe('SystemAuthUnavailableError', () => {
  const mockRequest = { host: 'http://system-auth' };
  let error: SystemAuthUnavailableError;

  beforeAll(() => {
    error = new SystemAuthUnavailableError(mockRequest);
  });

  it('constructor creates instance of error', () => {
    expect(error).toBeDefined();
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(SystemAuthError);
    expect(error).toBeInstanceOf(SystemAuthUnavailableError);
  });

  it('contains failed request', () => {
    expect(error.request).toBeDefined();
    expect(error.request).toEqual(mockRequest);
  });

  it('contains proper message', () => {
    expect(error.message).toBeDefined();
    expect(error.message).toEqual('Unable to get response from System Auth');
  });
});
