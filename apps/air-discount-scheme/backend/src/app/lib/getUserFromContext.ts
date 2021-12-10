import {
  environment as env
} from '../../environments'
import { User } from '../modules/user/user.model'
import { ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { decode } from 'jsonwebtoken'

export const getUserFromContext = (
  context: ExecutionContext & { contextType?: string },
): User => {
  const req = context.switchToHttp().getRequest()

  const sessionToken = req.cookies
    ? req.cookies[env.idsTokenCookieName]
    : null

  if (!sessionToken) {
    throw new UnauthorizedException('Invalid user')
  }

  const decodedToken = decode(sessionToken) as User

  return {
    firstName: decodedToken.name,
    nationalId: decodedToken.nationalId,
    address: decodedToken.address,
    postalcode: decodedToken.postalcode,
    

  }
}
