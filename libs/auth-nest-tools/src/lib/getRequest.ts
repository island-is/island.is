import { Request } from 'express'
import { ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Auth } from './auth'
import { User } from './user'

export type AuthRequest = Request & {
  auth?: Auth
  user?: User
}

export const getRequest = (
  context: ExecutionContext & { contextType?: string },
): AuthRequest => {
  if (context.contextType === 'graphql') {
    const ctx = GqlExecutionContext.create(context)
    return ctx.getContext().req
  }

  return context.switchToHttp().getRequest()
}
