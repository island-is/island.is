import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { User } from './user'
import { getRequest } from "./getRequest";

export const getCurrentUser = (context: ExecutionContext): User => {
  const request = getRequest(context)

  const user = request.user
  if (!user) {
    console.warn(
      'No user authentication found. Did you forget to add IdsUserGuard?',
    )
    throw new UnauthorizedException()
  }
  return user
}

export const CurrentUser = createParamDecorator(
  (options: unknown, context: ExecutionContext): User => {
    return getCurrentUser(context)
  },
)
