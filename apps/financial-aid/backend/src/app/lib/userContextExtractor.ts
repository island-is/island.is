import {
  decodeToken,
  IDENTITY_SERVER_SESSION_TOKEN_COOKIE_NAME,
  User,
} from '@island.is/financial-aid/shared/lib'
import { ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

export const getUserFromContext = (
  context: ExecutionContext & { contextType?: string },
): User | undefined => {
  const req =
    context.contextType === 'graphql'
      ? GqlExecutionContext.create(context).getContext().req
      : context.switchToHttp().getRequest()

  const cookies = req.cookies
  const sessionToken = cookies
    ? cookies[IDENTITY_SERVER_SESSION_TOKEN_COOKIE_NAME]
    : null

  if (!sessionToken) {
    return undefined
  }

  const decodedToken = decodeToken(sessionToken)

  return {
    name: decodedToken.name,
    nationalId: decodedToken.nationalId,
    folder: decodedToken.folder,
    service: decodedToken.service,
  }
}
