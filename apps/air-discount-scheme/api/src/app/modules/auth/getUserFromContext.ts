import environment from '../../../environments/environment'
import { AuthUser } from '@island.is/air-discount-scheme/types'
import { ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { decode } from 'jsonwebtoken'
import { GqlExecutionContext } from '@nestjs/graphql'

export const getUserFromContext = (
  context: ExecutionContext & { contextType?: string },
): AuthUser => {
  const req = GqlExecutionContext.create(context).getContext().req
  const sessionToken = req?.cookies
    ? req.cookies[environment.idsTokenCookieName]
    : null

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
