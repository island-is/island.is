import { concatMap, Observable } from 'rxjs'

import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { getTransactionContext } from '../middleware'

/**
 * Commits the transaction owned by `TransactionContextMiddleware` on the
 * success path, before the response is serialized - a commit that fails after
 * the client has been told 200 is unrecoverable.
 *
 * There is deliberately no error path here: the middleware rolls back anything
 * still open when the response ends, which covers handler errors, guards that
 * throw before any interceptor runs, and client aborts.
 */
@Injectable()
export class TransactionCommitInterceptor implements NestInterceptor {
  constructor(@Inject(LOGGER_PROVIDER) private readonly logger: Logger) {}

  private async commit() {
    const context = getTransactionContext()

    if (!context || context.settled) {
      return
    }

    try {
      // A request that never opened a transaction has nothing to commit, but
      // its callbacks still belong to a successful request.
      await context.transaction?.commit()
    } finally {
      // Settled either way, so the middleware does not roll back a transaction
      // whose commit has already failed, and the callbacks below run once.
      context.settled = true
    }

    for (const callback of context.afterCommit) {
      try {
        await callback()
      } catch (error) {
        // The work is committed - a failed announcement must not fail the
        // request, matching the fire-and-forget semantics of the side effects
        // these callbacks carry.
        this.logger.error('An after commit callback failed', { error })
      }
    }
  }

  intercept(_: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      concatMap(async (value) => {
        await this.commit()

        return value
      }),
    )
  }
}
