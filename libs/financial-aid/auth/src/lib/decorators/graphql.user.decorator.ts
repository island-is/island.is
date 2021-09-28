import { createParamDecorator } from '@nestjs/common'

import {
  decodeToken,
  IDENTITY_SERVER_SESSION_TOKEN_COOKIE_NAME,
  User,
} from '@island.is/financial-aid/shared/lib'

import { GqlExecutionContext } from '@nestjs/graphql'

export const CurrentGraphQlUser = createParamDecorator(
  (_: unknown, context: GqlExecutionContext): User => {
    const ctx = GqlExecutionContext.create(context)
    const cookies = ctx.getContext().req.cookies
    const sessionToken = cookies
      ? cookies[IDENTITY_SERVER_SESSION_TOKEN_COOKIE_NAME]
      : null
    const decodedToken = decodeToken(sessionToken)
    return {
      name: decodedToken.name,
      nationalId: decodedToken.nationalId,
      folder: decodedToken.folder,
      service: decodedToken.service,
      returnUrl: decodedToken.returnUrl,
    }
  },
)
