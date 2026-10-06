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
 * Pushes messages into the request's store. `MessageMiddleware` flushes the
 * store when the response ends, whatever happened to the database work in
 * between, so this is plumbing rather than a way to queue a message: the
 * backend queues from a request through `queueMessagesAfterCommit` in its
 * middleware, which registers this push with the request's transaction
 * context so that it happens only once the work is durable. Call it from
 * there and nowhere else.
 */
export const pushMessagesToRequestStore = (...messages: Message[]) => {
  requireMessageStore().push(...messages)
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
