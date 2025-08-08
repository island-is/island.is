import { from, lastValueFrom } from 'rxjs'
import tracer from 'dd-trace'
import {
  CallHandler,
  ExecutionContext,
  Inject,
  NestInterceptor,
} from '@nestjs/common'
import { getRequest } from '@island.is/auth-nest-tools'
import {
  type Logger,
  LOGGER_PROVIDER,
  withLoggingContext,
} from '@island.is/logging'

export class InfraInterceptor implements NestInterceptor {
  private readonly logger: Logger

  constructor(@Inject(LOGGER_PROVIDER) logger: Logger) {
    this.logger = logger.child({ context: 'AuthInterceptor' })
  }

  async intercept(executionContext: ExecutionContext, next: CallHandler) {
    const req = getRequest(executionContext)
    const authSid = req.auth?.sid
    const handlerClass = executionContext.getClass()
    const handlerFn = executionContext.getHandler()
    const handlerName = `${handlerClass.name}#${handlerFn.name}`

    this.logger.info(`Request: ${req.originalUrl}`, {
      authSid,
      req: {
        path: req.originalUrl,
        userAgent: req.headers['user-agent'],
      },
      handlerName,
    })

    return from(
      tracer.trace(
        'nestjs.handler',
        {
          resource: handlerName,
          tags: {
            authSid,
          },
        },
        () => lastValueFrom(this.maybeWrapLoggingContext(next, authSid)),
      ),
    )
  }

  maybeWrapLoggingContext(next: CallHandler, authSid?: string) {
    if (authSid) {
      return withLoggingContext({ authSid }, () => next.handle())
    } else {
      return next.handle()
    }
  }
}
