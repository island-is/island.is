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

export const addMessagesToQueue = (...messages: Message[]) => {
  const store = messageStorage.getStore()

  if (!store) {
    throw new InternalServerErrorException(
      'Message storage is not available. Make sure to use MessageMiddleware.',
    )
  }

  store.push(...messages)
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
