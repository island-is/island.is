import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { Auth } from './auth'
import { getRequest } from './getRequest'

export const getCurrentAuth = (context: ExecutionContext): Auth => {
  const request = getRequest(context)

  const auth = request.auth
  if (!auth) {
    console.warn(
      'No authentication found. Did you forget to add IdsAuthGuard or IdsUserGuard?',
    )
    throw new UnauthorizedException()
  }
  return auth
}

export const CurrentAuth = createParamDecorator(
  (data: unknown, context: ExecutionContext): Auth => {
    return getCurrentAuth(context)
  },
)
