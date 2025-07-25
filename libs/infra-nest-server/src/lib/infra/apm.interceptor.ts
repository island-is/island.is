import { getRequest } from '@island.is/auth-nest-tools'
import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import { from, lastValueFrom, Observable } from 'rxjs'
import tracer from 'dd-trace'

export class ApmInterceptor implements NestInterceptor {
  async intercept(
    executionContext: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const handlerClass = executionContext.getClass()
    const handlerFn = executionContext.getHandler()
    const request = getRequest(executionContext)

    return from(
      tracer.trace(
        'nestjs.handler',
        {
          resource: `${handlerClass.name}#${handlerFn.name}`,
          tags: {
            authSid: request.auth?.sid,
          },
        },
        () => lastValueFrom(next.handle()),
      ),
    )
  }
}
