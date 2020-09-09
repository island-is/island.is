import {
  ExecutionContext,
  Injectable,
  NestInterceptor,
  CallHandler,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import * as Sentry from '@sentry/node'

type SentryInterceptorOptions = {
  filterExceptions: any[]
}

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  options: SentryInterceptorOptions

  constructor(options?: SentryInterceptorOptions) {
    this.options = options
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(null, (exception) => {
        if (this.shouldReport(exception)) {
          Sentry.captureException(exception)
        }
      }),
    )
  }

  private shouldReport(exception: Error) {
    if (this.options && !this.options.filterExceptions) return true

    const filters: Error[] = this.options.filterExceptions || []
    return filters.every((type: any) => {
      return !(exception instanceof type)
    })
  }
}
