import jwt from 'jsonwebtoken'
import decode from 'jwt-decode'
import { ExecutionContext } from '@nestjs/common'
import { environment } from '../../../../environments'

export function getAuthorizationHeader(ctx: ExecutionContext): string {
  return ctx.switchToHttp().getRequest().headers.authorization
}

export function getNationalIdFromToken(ctx: ExecutionContext): string {
  const authorization = getAuthorizationHeader(ctx)
  const decodedToken = decode(authorization?.replace('Bearer ', '')) as {
    nationalId: string
  }
  return decodedToken.nationalId
}

export function verifyToken<T>(token: string): T | null {
  try {
    const decoded = (jwt.verify(
      token,
      environment.auth.jwtSecret,
    ) as unknown) as T
    return decoded
  } catch (e) {
    return null
  }
}
