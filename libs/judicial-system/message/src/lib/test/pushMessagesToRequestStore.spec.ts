import type { NextFunction, Request, Response } from 'express'
import { v4 as uuid } from 'uuid'

import { InternalServerErrorException } from '@nestjs/common'

import type { Logger } from '@island.is/logging'

import { Message, MessageType } from '../message'
import { addMessagesToQueue, MessageMiddleware } from '../message.middleware'
import { MessageService } from '../message.service'

const createResponse = () => {
  const listeners: Record<string, () => Promise<void> | void> = {}

  return {
    on: (event: string, listener: () => Promise<void> | void) => {
      listeners[event] = listener
    },
    emit: async (event: string) => await listeners[event]?.(),
  }
}

const createMessage = (type: MessageType): Message => ({
  type,
  caseId: uuid(),
})

describe('addMessagesToQueue', () => {
  const messageService = {
    addMessagesToQueue: jest.fn().mockResolvedValue(undefined),
  } as unknown as MessageService & { addMessagesToQueue: jest.Mock }
  const logger = {
    debug: jest.fn(),
    error: jest.fn(),
  } as unknown as Logger
  const middleware = new MessageMiddleware(messageService, logger)

  // Runs work inside a request that the middleware has wrapped. The response
  // is handed to work because 'finish' has to be emitted from inside the
  // request's own async context for the flush to find the request's store,
  // as it does in production.
  const givenARequest = async (
    work: (res: ReturnType<typeof createResponse>) => Promise<void> | void,
  ) => {
    const res = createResponse()

    // The middleware calls next() synchronously inside its ALS store, so the
    // promise work() returns is available as soon as use() has returned.
    let result: Promise<void> | undefined

    middleware.use(
      {} as Request,
      res as unknown as Response,
      (() => {
        result = Promise.resolve(work(res))
      }) as NextFunction,
    )

    await result
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  // Pins the behaviour the call sites not yet moved to the backend's after
  // commit form keep: the messages are flushed when the response ends,
  // whatever happened to the database work in between.
  it('should flush the messages when the response ends', async () => {
    const message = createMessage(MessageType.NOTIFICATION)

    await givenARequest(async (res) => {
      addMessagesToQueue(message)

      await res.emit('finish')
    })

    expect(messageService.addMessagesToQueue).toHaveBeenCalledTimes(1)
    expect(messageService.addMessagesToQueue).toHaveBeenCalledWith([message])
  })

  it('should throw outside a request', () => {
    expect(() =>
      addMessagesToQueue(createMessage(MessageType.NOTIFICATION)),
    ).toThrow(InternalServerErrorException)
  })
})
