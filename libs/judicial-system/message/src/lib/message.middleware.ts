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

interface MessageStore {
  /** Messages pushed since the store was last flushed. */
  messages: Message[]
  /**
   * Whether the response has ended and the store has been flushed. Nothing
   * flushes it again after that, so a message pushed from then on is sent
   * right away rather than left in the store.
   */
  flushed: boolean
  /** Sends what is in the store to the queue and empties it. */
  flush: () => Promise<void>
}

const messageStorage = new AsyncLocalStorage<MessageStore>()

const requireMessageStore = (): MessageStore => {
  const store = messageStorage.getStore()

  if (!store) {
    throw new InternalServerErrorException(
      'Message storage is not available. Make sure to use MessageMiddleware.',
    )
  }

  return store
}

/**
 * Pushes messages into the request's store. `MessageMiddleware` flushes the
 * store when the response ends, whatever happened to the database work in
 * between, so this is plumbing rather than a way to queue a message: the
 * backend queues from a request through `queueMessagesAfterCommit` in its
 * middleware, which registers this push with the request's transaction
 * context so that it happens only once the work is durable. Call it from
 * there and nowhere else.
 *
 * A push that arrives after the response has ended - the client aborted while
 * the commit was in flight, and the after commit callbacks ran once it had
 * come back - is sent right away, since the flush that would have carried it
 * has already happened.
 */
export const pushMessagesToRequestStore = (...messages: Message[]) => {
  const store = requireMessageStore()

  store.messages.push(...messages)

  if (store.flushed) {
    // Nothing waits for this: the response is gone, and the flush logs its own
    // failures.
    void store.flush()
  }
}

@Injectable()
export class MessageMiddleware implements NestMiddleware {
  constructor(
    private readonly messageService: MessageService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  use(_1: Request, res: Response, next: NextFunction) {
    const store: MessageStore = {
      messages: [],
      flushed: false,
      flush: async () => {
        const messages = store.messages.splice(0)

        this.logger.debug('Messages to send to queue', { messages })

        if (messages.length === 0) {
          return
        }

        try {
          await this.messageService.addMessagesToQueue(messages)
        } catch (error) {
          this.logger.error('Failed to send messages to queue', { error })
        }
      },
    }

    return messageStorage.run(store, () => {
      // 'close' rather than 'finish': 'finish' fires only for a response that
      // was sent in full, so messages about work that was committed before
      // the client aborted would never be flushed. On a completed response
      // 'close' follows 'finish', so the flush stays off the response path.
      //
      // The store is captured rather than read back, because 'close' can be
      // emitted from the socket rather than from the request's own async
      // context.
      res.on('close', async () => {
        store.flushed = true

        await store.flush()
      })

      return next()
    })
  }
}
