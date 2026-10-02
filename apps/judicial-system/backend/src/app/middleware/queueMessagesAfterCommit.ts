import { addMessagesToQueue, Message } from '@island.is/judicial-system/message'

import { registerAfterCommit } from './transactionContext.middleware'

/**
 * Queues messages for the request once its database work is durable: after
 * the request transaction has committed, or on the way out of a successful
 * request that opened none. A request whose transaction rolls back queues
 * nothing, so the message handler is never asked to deliver something the
 * database never accepted.
 *
 * This is the one way to queue a message from a request. `addMessagesToQueue`
 * pushes right away and is flushed by `MessageMiddleware` when the response
 * ends, whatever happened to the database work in between.
 *
 * The callback runs on the success path, so a handler that commits a
 * transaction of its own must return right after the commit - see
 * `TransactionCommitInterceptor`.
 */
export const queueMessagesAfterCommit = (...messages: Message[]) => {
  registerAfterCommit(async () => {
    addMessagesToQueue(...messages)
  })
}
