import jwt, { VerifyErrors } from 'jsonwebtoken'

import { logger } from '@island.is/logging'

import { environment } from '../../../../environments'

export function verifyToken<T>(token: string): T | 'TokenExpiredError' | null {
  try {
    return (jwt.verify(
      token,
      environment.templateApi.jwtSecret,
    ) as unknown) as T
  } catch (e) {
    const errors = e as VerifyErrors | null

    if (errors?.name === 'TokenExpiredError') {
      return 'TokenExpiredError'
    }

    return null
  }
}

export function decodeToken<T>(token: string): T | null {
  try {
    return (jwt.decode(token) as unknown) as T
  } catch (e) {
    logger.error('Cannot decode token', { e })

    return null
  }
}
