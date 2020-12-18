import jwt from 'jsonwebtoken'
import decode from 'jwt-decode'
import { ExecutionContext } from '@nestjs/common'
import { environment } from '../../../../environments'

export function getNationalIdFromToken(ctx: ExecutionContext): string {
  const request = ctx.switchToHttp().getRequest()
  try {
    const decodedToken = decode(
      request.headers.authorization?.replace('Bearer ', ''),
    ) as { nationalId: string }
    return decodedToken.nationalId
  } catch (e) {
    throw new Error(e)
  }
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
