import type { NextFunction, Request, Response } from 'express'
import { v4 as uuid } from 'uuid'

import { InternalServerErrorException } from '@nestjs/common'

import type { Logger } from '@island.is/logging'

import { Message, MessageType } from '../message'
import {
  MessageMiddleware,
  pushMessagesToRequestStore,
} from '../message.middleware'
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

describe('MessageMiddleware', () => {
  const messageService = {
    addMessagesToQueue: jest.fn().mockResolvedValue(undefined),
  } as unknown as MessageService & { addMessagesToQueue: jest.Mock }
  const logger = {
    debug: jest.fn(),
    error: jest.fn(),
  } as unknown as Logger
  const middleware = new MessageMiddleware(messageService, logger)

  // Runs work inside a request that the middleware has wrapped, and hands back
  // the response so that a test can end the request from outside the request's
  // own async context. work also receives the response, for the cases that end
  // it from inside and then push again. A completed response ends with
  // 'finish' and then 'close'; an aborted one with 'close' alone.
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

    return res
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('pushMessagesToRequestStore', () => {
    it('should throw outside a request', () => {
      expect(() =>
        pushMessagesToRequestStore(createMessage(MessageType.NOTIFICATION)),
      ).toThrow(InternalServerErrorException)
    })

    // The store knows nothing of the database work: whatever was pushed is
    // flushed when the response ends. Holding the push back until the work
    // is durable is the backend's queueMessagesAfterCommit's job.
    it('should hold the messages until the response ends', async () => {
      const message = createMessage(MessageType.NOTIFICATION)

      await givenARequest(async (res) => {
        pushMessagesToRequestStore(message)

        expect(messageService.addMessagesToQueue).not.toHaveBeenCalled()

        await res.emit('close')
      })

      expect(messageService.addMessagesToQueue).toHaveBeenCalledTimes(1)
      expect(messageService.addMessagesToQueue).toHaveBeenCalledWith([message])
    })

    it('should send a message pushed after the response ended right away', async () => {
      // The abort during commit race: the client aborted while the commit
      // was in flight, 'close' flushed an empty store, and the after commit
      // callbacks then pushed what the committed work has to announce. The
      // flush that would have carried it has already happened, so it is sent
      // right away rather than left in the store.
      const message = createMessage(MessageType.NOTIFICATION)

      await givenARequest(async (res) => {
        await res.emit('close')

        expect(messageService.addMessagesToQueue).not.toHaveBeenCalled()

        pushMessagesToRequestStore(message)
      })

      expect(messageService.addMessagesToQueue).toHaveBeenCalledTimes(1)
      expect(messageService.addMessagesToQueue).toHaveBeenCalledWith([message])
    })

    it('should send a message pushed while the flush is in flight, once', async () => {
      // The flush takes what is in the store before it goes to the queue, so
      // a message pushed while that round trip is still running is not
      // picked up by it, and is not left behind either: it is sent on its
      // own.
      const first = createMessage(MessageType.NOTIFICATION)
      const second = createMessage(MessageType.DELIVERY_TO_COURT_CASE_FILE)
      let finishSending: () => void = () => undefined
      messageService.addMessagesToQueue.mockReturnValueOnce(
        new Promise<void>((resolve) => {
          finishSending = resolve
        }),
      )

      await givenARequest(async (res) => {
        pushMessagesToRequestStore(first)

        const closing = res.emit('close')

        pushMessagesToRequestStore(second)

        finishSending()

        await closing
      })

      expect(messageService.addMessagesToQueue).toHaveBeenCalledTimes(2)
      expect(messageService.addMessagesToQueue).toHaveBeenNthCalledWith(1, [
        first,
      ])
      expect(messageService.addMessagesToQueue).toHaveBeenNthCalledWith(2, [
        second,
      ])
    })

    it('should send each push after the response ended once', async () => {
      const first = createMessage(MessageType.NOTIFICATION)
      const second = createMessage(MessageType.DELIVERY_TO_COURT_CASE_FILE)

      await givenARequest(async (res) => {
        pushMessagesToRequestStore(first)

        await res.emit('close')

        pushMessagesToRequestStore(second)
      })

      expect(messageService.addMessagesToQueue).toHaveBeenCalledTimes(2)
      expect(messageService.addMessagesToQueue).toHaveBeenNthCalledWith(1, [
        first,
      ])
      expect(messageService.addMessagesToQueue).toHaveBeenNthCalledWith(2, [
        second,
      ])
    })
  })

  describe('when the response ends', () => {
    it('should flush once, after a completed response has finished', async () => {
      // 'finish' is the response reaching the client in full; the queue is
      // not touched before then, so the round trip to it stays off the
      // response path. The flush comes with 'close', which follows.
      const message = createMessage(MessageType.NOTIFICATION)

      await givenARequest(async (res) => {
        pushMessagesToRequestStore(message)

        await res.emit('finish')

        expect(messageService.addMessagesToQueue).not.toHaveBeenCalled()

        await res.emit('close')
      })

      expect(messageService.addMessagesToQueue).toHaveBeenCalledTimes(1)
      expect(messageService.addMessagesToQueue).toHaveBeenCalledWith([message])
    })

    it('should flush an aborted response', async () => {
      // A client abort ends the response with 'close' alone. The messages
      // are about work that was committed before the abort, so they are
      // flushed all the same.
      const message = createMessage(MessageType.NOTIFICATION)

      await givenARequest(async (res) => {
        pushMessagesToRequestStore(message)

        await res.emit('close')
      })

      expect(messageService.addMessagesToQueue).toHaveBeenCalledTimes(1)
      expect(messageService.addMessagesToQueue).toHaveBeenCalledWith([message])
    })

    it('should flush when the response ends outside the request context', async () => {
      // 'close' can be emitted from the socket rather than from the request's
      // own async context, where the store is not to be found: the middleware
      // flushes the store it captured instead.
      const message = createMessage(MessageType.NOTIFICATION)

      const res = await givenARequest(() => {
        pushMessagesToRequestStore(message)
      })

      await res.emit('close')

      expect(messageService.addMessagesToQueue).toHaveBeenCalledTimes(1)
      expect(messageService.addMessagesToQueue).toHaveBeenCalledWith([message])
    })

    it('should not flush twice', async () => {
      const message = createMessage(MessageType.NOTIFICATION)

      const res = await givenARequest(() => {
        pushMessagesToRequestStore(message)
      })

      await res.emit('close')
      await res.emit('close')

      expect(messageService.addMessagesToQueue).toHaveBeenCalledTimes(1)
    })

    it('should not touch the queue when nothing was pushed', async () => {
      const res = await givenARequest(() => undefined)

      await res.emit('close')

      expect(messageService.addMessagesToQueue).not.toHaveBeenCalled()
    })

    it('should log a failed flush rather than throw', async () => {
      const error = new Error('Some error')
      messageService.addMessagesToQueue.mockRejectedValueOnce(error)

      const res = await givenARequest(() => {
        pushMessagesToRequestStore(createMessage(MessageType.NOTIFICATION))
      })

      await expect(res.emit('close')).resolves.toBeUndefined()
      expect(logger.error).toHaveBeenCalledWith(
        'Failed to send messages to queue',
        { error },
      )
    })
  })
})
