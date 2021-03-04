import decode from 'jwt-decode'
import { ExecutionContext } from '@nestjs/common'

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
