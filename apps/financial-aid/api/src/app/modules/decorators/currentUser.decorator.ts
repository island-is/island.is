import {
  IDENTITY_SERVER_SESSION_TOKEN_COOKIE_NAME,
  User,
} from '@island.is/financial-aid/shared/lib'

import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GraphQLError } from 'graphql'
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
      throw new GraphQLError('Invalid user', {
        extensions: { code: 'UNAUTHENTICATED' },
      })
    }

    const secret = process.env.NEXTAUTH_SECRET
    if (!secret) {
      throw new GraphQLError('NEXTAUTH_SECRET is not configured', {
        extensions: { code: 'UNAUTHENTICATED' },
      })
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
