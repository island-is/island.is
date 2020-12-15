import decode from 'jwt-decode'
import { ExecutionContext } from '@nestjs/common'

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
