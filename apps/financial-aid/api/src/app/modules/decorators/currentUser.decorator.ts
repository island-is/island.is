import {
  IDENTITY_SERVER_SESSION_TOKEN_COOKIE_NAME,
  User,
} from '@island.is/financial-aid/shared/lib'

import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { AuthenticationError } from 'apollo-server-express'
import { GqlExecutionContext } from '@nestjs/graphql'
import { jwtDecrypt } from 'jose'
import { hkdf } from '@panva/hkdf'

export const CurrentUser = createParamDecorator(
  async (_: unknown, context: ExecutionContext): Promise<User> => {
    const req = GqlExecutionContext.create(context).getContext().req

    const sessionToken = req.cookies
      ? req.cookies[IDENTITY_SERVER_SESSION_TOKEN_COOKIE_NAME]
      : null

    if (!sessionToken) {
      throw new AuthenticationError('Invalid user')
    }

    const secret = process.env.NEXTAUTH_SECRET
    if (!secret) {
      throw new AuthenticationError('NEXTAUTH_SECRET is not configured')
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
    }
  },
)
