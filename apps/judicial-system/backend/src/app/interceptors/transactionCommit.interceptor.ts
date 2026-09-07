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

    if (!context || context.settlement !== 'open') {
      return
    }

    // Claimed before anything is awaited. A commit takes as long as it takes,
    // and the response can close while it is in flight - a client abort, since
    // nothing has been written to the socket yet. Without the claim the close
    // handler would see an unsettled slot and roll back the very transaction
    // that is committing.
    context.settlement = 'settling'

    try {
      // A request that never opened a transaction has nothing to commit, but
      // its callbacks still belong to a successful request. The slot holds the
      // opening call rather than the transaction, so it is awaited here: on the
      // success path it has long since resolved, unless something asked for a
      // transaction without waiting for it.
      const transaction = await context.transaction

      await transaction?.commit()
    } finally {
      // Settled either way, so the middleware does not roll back a transaction
      // whose commit has already failed, and the callbacks below run once.
      context.settlement = 'settled'
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
