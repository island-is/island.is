import { withLoggingContext } from '@island.is/logging'
import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import { getRequest } from './getRequest'

export class AuthInterceptor implements NestInterceptor {
  async intercept(executionContext: ExecutionContext, next: CallHandler) {
    const req = getRequest(executionContext)
    const authSid = req.auth?.sid

    if (authSid) {
      return withLoggingContext(
        {
          authSid,
        },
        () => next.handle(),
      )
    } else {
      return next.handle()
    }
  }
}
