import {
  IDENTITY_SERVER_SESSION_TOKEN_COOKIE_NAME,
  User,
} from '@island.is/financial-aid/shared/lib'
import { ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { decode } from 'jsonwebtoken'

export const getUserFromContext = (
  context: ExecutionContext & { contextType?: string },
): User => {
  const req = context.switchToHttp().getRequest()

  const sessionToken = req.cookies
    ? req.cookies[IDENTITY_SERVER_SESSION_TOKEN_COOKIE_NAME]
    : null

  if (!sessionToken) {
    throw new UnauthorizedException('Invalid user')
  }

  const decodedToken = decode(sessionToken) as User

  return {
    name: decodedToken.name,
    nationalId: decodedToken.nationalId,
    folder: decodedToken.folder,
    service: decodedToken.service,
  }
}
