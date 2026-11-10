import type { Model, ModelStatic, QueryOptions } from 'sequelize'

import { InternalServerErrorException } from '@nestjs/common'

import type { Logger } from '@island.is/logging'

import { getTransactionContext } from './transactionContext.middleware'

/**
 * A query ran without the request's transaction while that transaction was
 * open. See `createRequestTransactionQueryHook` for why that is an error
 * rather than a slow query.
 *
 * An `InternalServerErrorException` rather than a bare `Error`, so that the
 * message reaches the response body: that is where a developer hitting it from
 * the web app or an e2e trace looks first.
 */
export class QueryOutsideRequestTransactionError extends InternalServerErrorException {
  constructor(message: string) {
    super(message)
    this.name = 'QueryOutsideRequestTransactionError'
  }
}

/**
 * The query options Sequelize hands a `beforeQuery` hook. `model` is set on
 * queries issued through a model and absent on raw ones.
 */
export type HookedQueryOptions = QueryOptions & { model?: ModelStatic<Model> }

const describeQuery = (options: HookedQueryOptions) =>
  `${options.type ?? 'unknown'} query on ${options.model?.name ?? 'no model'}`

/**
 * Builds a Sequelize `beforeQuery` hook that refuses, or reports, a query
 * running outside the request's transaction while that transaction is open.
 *
 * A route whose guard reads the case under `FOR UPDATE` holds the row lock, and
 * one pool connection, until `TransactionCommitInterceptor` commits. A query
 * in that request that carries no transaction needs a second connection. With
 * a pool of five, the other connections are typically held by concurrent
 * requests for the same case, each blocked on the lock the first one holds.
 * The lock holder then waits for a connection and the connection holders wait
 * for the lock: every request fails after the pool's acquire timeout, and
 * nothing else on the pod gets a connection in the meantime. The hook catches
 * the pattern whenever it runs, which is long before the pool is contended.
 *
 * Only a query with no transaction at all is caught. A query on a transaction
 * the handler opened itself is the self-deadlock `CaseExistsForUpdateGuard`
 * documents, and is left to that guard's rule.
 *
 * Outside a request, on a route that opened no transaction, and once the
 * request's transaction is committing or has settled - the after commit
 * callbacks run then, with the lock released - the hook does nothing.
 *
 * Sequelize runs the hook after it has acquired the query's connection, so a
 * query that would wedge the pool is reported when it runs, not when it waits.
 * The stack of the thrown error does not reach the caller either: Sequelize
 * runs queries inside a retry wrapper that starts a new async context. The
 * query type and model are what there is to go on, together with the logging
 * context's request and case ids.
 *
 * `strict` throws, so that the offending request fails where someone is
 * looking at it; otherwise the query is reported and allowed to run. The
 * caller decides which from `NODE_ENV`, and every deployed environment - dev
 * and staging included - runs the production image with `NODE_ENV=production`,
 * so only a locally started backend, and an e2e run against one, throws.
 */
export const createRequestTransactionQueryHook = ({
  logger,
  strict,
}: {
  logger: Logger
  strict: boolean
}) => {
  return (options: HookedQueryOptions): void => {
    const context = getTransactionContext()

    if (!context?.transaction || context.settlement !== 'open') {
      return
    }

    if (options.transaction) {
      return
    }

    const message = `A ${describeQuery(
      options,
    )} ran outside the open request transaction. Pass the request's transaction to it: without one it needs a second pool connection, while the other requests holding connections are blocked on this transaction's row lock.`

    if (strict) {
      throw new QueryOutsideRequestTransactionError(message)
    }

    logger.error(message, {
      queryType: options.type,
      model: options.model?.name,
    })
  }
}
