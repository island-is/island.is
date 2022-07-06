import { environment as env } from '../../environments'
import { AuthUser } from '@island.is/air-discount-scheme/types'
import { ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { decode } from 'jsonwebtoken'

export const getUserFromContext = (
  context: ExecutionContext & { contextType?: string },
): AuthUser => {
  const req = context.switchToHttp().getRequest()

  const sessionToken = req.cookies ? req.cookies[env.idsTokenCookieName] : null

  if (!sessionToken) {
    throw new UnauthorizedException('Invalid user')
  }

  const decodedToken = decode(sessionToken) as AuthUser

  return {
    name: decodedToken.name,
    nationalId: decodedToken.nationalId,
    mobile: decodedToken.mobile,
    role: decodedToken.role,
    meetsADSRequirements: decodedToken.meetsADSRequirements,
    flightLegs: decodedToken.flightLegs,
  }
}
