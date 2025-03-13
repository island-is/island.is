import jwt from 'jsonwebtoken'
import {
  GetLoginSearchParamsReturnValue,
  TokenResponse,
} from '../src/app/modules/ids/ids.types'

export const SESSION_COOKIE_NAME = 'sid'
export const ALGORITM_TYPE = 'HS256'
export const SID_VALUE = 'fake_uuid'

const ONE_HOUR_EXPIRATION = Math.floor(Date.now() / 1000) + 3600

// A valid 32-byte base64 key
export const tokenSecretBase64 = 'ABHlmq6Ic6Ihip4OnTa1MeUXtHFex8IT/mFZrjhsme0='

export const mockedTokensResponse: TokenResponse = {
  access_token: jwt.sign(
    {
      exp: ONE_HOUR_EXPIRATION,
    },
    'mockSecret',
    { algorithm: ALGORITM_TYPE },
  ),
  id_token: jwt.sign(
    {
      iss: 'https://example.com',
      sub: '1234567890',
      exp: ONE_HOUR_EXPIRATION,
      sid: SID_VALUE,
    },
    'mockSecret',
    { algorithm: ALGORITM_TYPE },
  ),
  refresh_token: 'mockRefreshToken1234567890',
  scope: 'openid profile email',
  token_type: 'Bearer',
  expires_in: 3600,
}

export const getLoginSearchParmsFn = (args: {
  sid: string
  codeChallenge: string
  loginHint?: string
  prompt?: string
}): GetLoginSearchParamsReturnValue => ({
  client_id: '@test_client_id',
  redirect_uri: 'http://localhost:3010/testclient/bff/callbacks/login',
  response_type: 'code',
  response_mode: 'query',
  scope: 'test_scope offline_access openid profile',
  state: SID_VALUE,
  code_challenge: 'test_code_challenge',
  code_challenge_method: 'test_code_challenge_method',
  ...(args.loginHint && { login_hint: args.loginHint }),
  ...(args.prompt && { prompt: args.prompt }),
})
