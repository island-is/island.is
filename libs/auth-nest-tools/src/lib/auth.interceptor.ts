import { Logger, LOGGER_PROVIDER, withLoggingContext } from '@island.is/logging'
import {
  CallHandler,
  ExecutionContext,
  Inject,
  NestInterceptor,
} from '@nestjs/common'
import { tap } from 'rxjs'
import { AuthRequest } from './auth.request'
import { getRequest } from './getRequest'

export class AuthInterceptor implements NestInterceptor {
  private readonly logger: Logger

  constructor(@Inject(LOGGER_PROVIDER) logger: Logger) {
    this.logger = logger.child({ context: 'AuthInterceptor' })
  }

  async intercept(executionContext: ExecutionContext, next: CallHandler) {
    const req = getRequest(executionContext)
    const authSid = req.auth?.sid
    if (!authSid) {
      return next.handle()
    }

    const handlerClass = executionContext.getClass()
    const handlerFn = executionContext.getHandler()
    const handlerName = `${handlerClass.name}#${handlerFn.name}`
    this.logger.info(`Authenticated Request: ${req.originalUrl}`, {
      authSid,
      req: {
        path: req.originalUrl,
        userAgent: req.headers['user-agent'],
      },
      handlerName,
    })

    if (authSid) {
      return withLoggingContext({ authSid }, () => next.handle())
    } else {
      return next.handle()
    }
  }
}
