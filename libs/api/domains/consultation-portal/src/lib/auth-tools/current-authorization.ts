import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'

import { getRequest } from './getRequest'

export const getCurrentAuthorization = (context: ExecutionContext): string => {
  const request = getRequest(context)

  const authorizationString = request.headers.authorization
  if (authorizationString === undefined) {
    console.error('No authorization found')
    throw new UnauthorizedException()
  }
  return authorizationString
}

export const CurrentAuthorization = createParamDecorator(
  (options: unknown, context: ExecutionContext): string => {
    return getCurrentAuthorization(context)
  },
)
