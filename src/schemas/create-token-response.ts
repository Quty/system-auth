import z from 'myzod';

import { ACCESS_TOKEN_FIELD_NAME, EXPIRES_IN_FIELD_NAME } from '../constants';

export const createTokenResponseSchema = z.object({
  [ACCESS_TOKEN_FIELD_NAME]: z.string(),
  [EXPIRES_IN_FIELD_NAME]: z.number(),
});
