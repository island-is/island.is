import environment from '../../../environments/environment'
import { AuthUser } from '@island.is/air-discount-scheme/types'
import { ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { jwtDecrypt } from 'jose'
import { hkdf } from '@panva/hkdf'
import { GqlExecutionContext } from '@nestjs/graphql'

export const getUserFromContext = async (
  context: ExecutionContext & { contextType?: string },
): Promise<AuthUser> => {
  const req = GqlExecutionContext.create(context).getContext().req
  const sessionToken = req?.cookies
    ? req.cookies[environment.idsTokenCookieName]
    : null

  if (!sessionToken) {
    throw new UnauthorizedException('Invalid user')
  }

  const secret = process.env.NEXTAUTH_SECRET
  if (!secret) {
    throw new UnauthorizedException('NEXTAUTH_SECRET is not configured')
  }

  const encryptionKey = await hkdf(
    'sha256',
    secret,
    '',
    'NextAuth.js Generated Encryption Key',
    32,
  )

  const { payload } = await jwtDecrypt(sessionToken, encryptionKey, {
    clockTolerance: 15,
  })

  return {
    name: payload.name as string,
    nationalId: payload.nationalId as string,
    mobile: payload.mobile as string,
    role: payload.role as AuthUser['role'],
    meetsADSRequirements: payload.meetsADSRequirements as boolean,
    flightLegs: payload.flightLegs as AuthUser['flightLegs'],
  }
}
