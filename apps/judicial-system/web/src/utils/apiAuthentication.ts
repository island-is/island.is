import { verify } from 'jsonwebtoken'
import type { NextApiRequest } from 'next'

import { ACCESS_TOKEN_COOKIE_NAME } from '@island.is/judicial-system/consts'
import type { AuthUser, Credentials } from '@island.is/judicial-system/types'

// judicial-system-api signs the access token cookie with AUTH_JWT_SECRET and a
// deployed web server is given the same secret. Without it a request cannot be
// authenticated and has to be refused: falling back to a well known value
// would let anyone mint a token. Only a local run may fall back, and the value
// is the development default of sharedAuthModuleConfig so that the web server
// accepts the tokens the local api issues. A deployed environment is told
// apart by ENVIRONMENT, which the service definition always sets.
const getJwtSecret = () => {
  const secret = process.env.AUTH_JWT_SECRET

  if (secret) {
    return secret
  }

  return process.env.ENVIRONMENT ? undefined : 'jwt-secret'
}

/**
 * Verifies the session the browser presents to an api route, the way
 * JwtStrategy verifies it for the api and the backend. Returns undefined when
 * the request carries no usable session, which the caller answers with 401.
 */
export const authenticateApiRequest = (
  req: NextApiRequest,
): AuthUser | undefined => {
  const secret = getJwtSecret()
  const token = req.cookies[ACCESS_TOKEN_COOKIE_NAME]

  if (!secret || !token) {
    return undefined
  }

  let credentials: Credentials

  try {
    // Throws on a bad signature and on an expired token.
    credentials = verify(token, secret) as Credentials
  } catch {
    return undefined
  }

  if (!credentials?.currentUserNationalId) {
    return undefined
  }

  // A token carrying a csrf token is only accepted from a caller that can echo
  // it back, which a cross site caller cannot - the csrf cookie it is read
  // from is readable by our own scripts alone.
  if (
    credentials.csrfToken &&
    `Bearer ${credentials.csrfToken}` !== req.headers.authorization
  ) {
    return undefined
  }

  return {
    currentUserNationalId: credentials.currentUserNationalId,
    currentUser: credentials.currentUser,
  }
}
