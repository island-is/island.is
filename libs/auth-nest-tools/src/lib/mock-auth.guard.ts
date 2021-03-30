import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { User } from './user'

@Injectable()
export class MockAuthGuard implements CanActivate {
  user: User

  constructor(user: Partial<User>) {
    this.user = {
      nationalId: '1234567890',
      authorization: '',
      client: 'mock',
      scope: [],
      ...user,
    }
  }

  canActivate(context: ExecutionContext): boolean {
    const request = this.getRequest(context)
    request.user = this.user
    return true
  }

  getRequest(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()

    if (request) {
      return request
    } else {
      const ctx = GqlExecutionContext.create(context)

      return ctx.getContext().req
    }
  }
}
