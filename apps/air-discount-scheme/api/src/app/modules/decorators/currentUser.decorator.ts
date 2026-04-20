import { User } from '../user/models/user.model'
import { environment } from '../../../environments'
import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { jwtDecrypt } from 'jose'
import { hkdf } from '@panva/hkdf'

export const CurrentUser = createParamDecorator(
  async (_: unknown, context: ExecutionContext): Promise<User> => {
    const req = GqlExecutionContext.create(context).getContext().req
    const sessionToken = req.cookies
      ? req.cookies[environment.idsTokenCookieName]
      : null

    if (!sessionToken) {
      return null as User
    }

    const secret = process.env.NEXTAUTH_SECRET
    if (!secret) {
      return null as User
    }

    let payload
    try {
      const encryptionKey = await hkdf(
        'sha256',
        secret,
        '',
        'NextAuth.js Generated Encryption Key',
        32,
      )

      const result = await jwtDecrypt(sessionToken, encryptionKey, {
        clockTolerance: 15,
      })
      payload = result.payload
    } catch {
      return null as User
    }

    return {
      name: payload.name as string,
      nationalId: payload.nationalId as string,
      mobile: payload.mobile as string,
      role: payload.role as User['role'],
      meetsADSRequirements: payload.meetsADSRequirements as boolean,
      flightLegs: payload.flightLegs as User['flightLegs'],
    }
  },
)
