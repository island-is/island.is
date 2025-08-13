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
    this.logger = logger.child
      ? logger.child({ context: 'InfraInterceptor' })
      : logger
  }

  async intercept(executionContext: ExecutionContext, next: CallHandler) {
    const req = getRequest(executionContext)
    const traceSid = req.auth?.traceSid
    const handlerClass = executionContext.getClass()
    const handlerFn = executionContext.getHandler()
    const handlerName = `${handlerClass.name}#${handlerFn.name}`

    // Only log authenticated requests for now. This is to reduce redundant log
    // noise from the bff and health endpoints.
    if (traceSid) {
      this.logger.info(`${req.method} ${req.originalUrl}`, {
        traceSid,
        userAgent: req.headers['user-agent'],
        handlerName,
      })
    }

    return from(
      tracer.trace(
        'nestjs.handler',
        {
          resource: handlerName,
          tags: {
            traceSid,
          },
        },
        () => lastValueFrom(this.maybeWrapLoggingContext(next, traceSid)),
      ),
    )
  }

  maybeWrapLoggingContext(next: CallHandler, traceSid?: string) {
    if (traceSid) {
      return withLoggingContext({ traceSid }, () => next.handle())
    } else {
      return next.handle()
    }
  }
}
