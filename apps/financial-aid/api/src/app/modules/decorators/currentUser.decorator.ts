import {
  decodeToken,
  IDENTITY_SERVER_SESSION_TOKEN_COOKIE_NAME,
  User,
} from '@island.is/financial-aid/shared/lib'

import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'

import { GqlExecutionContext } from '@nestjs/graphql'

export const CurrentUser = createParamDecorator(
  (_: unknown, context: ExecutionContext): User => {
    const req = GqlExecutionContext.create(context).getContext().req

    const sessionToken = req.cookies
      ? req.cookies[IDENTITY_SERVER_SESSION_TOKEN_COOKIE_NAME]
      : null

    if (!sessionToken) {
      throw new UnauthorizedException('Invalid user')
    }

    const decodedToken = decodeToken(sessionToken)

    return {
      name: decodedToken.name,
      nationalId: decodedToken.nationalId,
      folder: decodedToken.folder,
      service: decodedToken.service,
    }
  },
)
