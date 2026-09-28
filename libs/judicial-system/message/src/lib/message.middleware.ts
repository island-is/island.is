import { AsyncLocalStorage } from 'async_hooks'
import type { NextFunction, Request, Response } from 'express'

import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NestMiddleware,
} from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { Message } from './message'
import { MessageService } from './message.service'

const messageStorage = new AsyncLocalStorage<Message[]>()

const requireMessageStore = (): Message[] => {
  const store = messageStorage.getStore()

  if (!store) {
    throw new InternalServerErrorException(
      'Message storage is not available. Make sure to use MessageMiddleware.',
    )
  }

  return store
}

/**
 * A Sequelize `Transaction`, seen through the one method this library needs.
 * Named structurally so that the library does not depend on sequelize for a
 * type. Sequelize 6 runs the registered functions once the transaction has
 * committed and never when it is rolled back.
 */
export interface AfterCommitTransaction {
  afterCommit(fn: () => void): void
}

/**
 * Queues messages for the request regardless of what happens to the database
 * work they announce: `MessageMiddleware` flushes the request's messages when
 * the response ends, and it ends for a rolled-back request too. Messages queued
 * inside a transaction that then rolls back are therefore still sent, and the
 * message handler retries a delivery whose subject was never committed.
 *
 * Prefer `addMessagesToQueueAfterCommit`, which sends nothing for a
 * transaction that is rolled back. This form remains for the call sites that
 * have not yet been migrated to it, so that they keep the behaviour they have
 * today.
 */
export const addMessagesToQueue = (...messages: Message[]) => {
  requireMessageStore().push(...messages)
}

/**
 * Queues messages for the request once `transaction` has committed, so that a
 * transaction which rolls back sends nothing.
 *
 * The transaction is required rather than optional: a call site must either
 * pass the transaction its database work runs in, or state `undefined` to say
 * that it has none. Without a transaction the writes are autocommitted and
 * already durable, so the messages are queued immediately and flushed when the
 * response ends, exactly as `addMessagesToQueue` does. Omitting the argument is
 * a type error, so a transaction that was not threaded through to the call site
 * cannot silently fall through to the unconditional behaviour.
 *
 * The request's message store is looked up when this is called, so calling it
 * outside a request throws right away rather than when the transaction commits.
 */
export const addMessagesToQueueAfterCommit = (
  transaction: AfterCommitTransaction | undefined,
  ...messages: Message[]
) => {
  const store = requireMessageStore()

  if (!transaction) {
    store.push(...messages)

    return
  }

  // The store is captured here rather than read back inside the hook, so that
  // the messages reach this request's store even if the transaction is
  // committed from outside the request's async context.
  transaction.afterCommit(() => {
    store.push(...messages)
  })
}

@Injectable()
export class MessageMiddleware implements NestMiddleware {
  constructor(
    private readonly messageService: MessageService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  use(_1: Request, res: Response, next: NextFunction) {
    return messageStorage.run([], () => {
      res.on('finish', async () => {
        const messages = messageStorage.getStore()
        this.logger.debug('Messages to send to queue', { messages })
        if (messages && messages.length > 0) {
          try {
            await this.messageService.addMessagesToQueue(messages)
          } catch (error) {
            this.logger.error('Failed to send messages to queue', { error })
          }
        }
      })

      return next()
    })
  }
}
