import { ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { GqlExecutionContext } from '@nestjs/graphql'

@Injectable()
export class IdsAuthGuard extends AuthGuard('jwt') {
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
