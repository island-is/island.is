import { AsyncResource } from 'async_hooks'
import type { NextFunction, Request, Response } from 'express'
import { v4 as uuid } from 'uuid'

import { InternalServerErrorException } from '@nestjs/common'

import type { Logger } from '@island.is/logging'

import { Message, MessageType } from '../message'
import {
  addMessagesToQueue,
  addMessagesToQueueAfterCommit,
  AfterCommitTransaction,
  MessageMiddleware,
} from '../message.middleware'
import { MessageService } from '../message.service'

// What this library sees of a Sequelize transaction: functions registered
// with afterCommit run when the transaction commits, and never when it is
// rolled back. A rollback is therefore represented by not calling commit.
const createTransaction = () => {
  const hooks: (() => void)[] = []

  return {
    afterCommit: (fn: () => void) => {
      hooks.push(fn)
    },
    commit: () => {
      for (const hook of hooks) {
        hook()
      }
    },
  }
}

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

describe('addMessagesToQueueAfterCommit', () => {
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

  it('should flush the messages of a transaction that commits', async () => {
    const transaction = createTransaction()
    const messages = [
      createMessage(MessageType.DELIVERY_TO_COURT_CASE_FILE),
      createMessage(MessageType.NOTIFICATION),
    ]

    await givenARequest(async (res) => {
      addMessagesToQueueAfterCommit(transaction, ...messages)
      transaction.commit()

      await res.emit('finish')
    })

    expect(messageService.addMessagesToQueue).toHaveBeenCalledTimes(1)
    expect(messageService.addMessagesToQueue).toHaveBeenCalledWith(messages)
  })

  it('should flush nothing for a transaction that rolls back', async () => {
    const transaction = createTransaction()

    await givenARequest(async (res) => {
      addMessagesToQueueAfterCommit(
        transaction,
        createMessage(MessageType.NOTIFICATION),
      )

      // Never committed: Sequelize does not run after commit hooks on rollback.
      await res.emit('finish')
    })

    expect(messageService.addMessagesToQueue).not.toHaveBeenCalled()
  })

  it('should flush only the messages of the transactions that commit', async () => {
    const committed = createTransaction()
    const rolledBack = createTransaction()
    const committedMessage = createMessage(MessageType.NOTIFICATION)

    await givenARequest(async (res) => {
      addMessagesToQueueAfterCommit(
        rolledBack,
        createMessage(MessageType.DELIVERY_TO_COURT_CASE_FILE),
      )
      addMessagesToQueueAfterCommit(committed, committedMessage)
      committed.commit()

      await res.emit('finish')
    })

    expect(messageService.addMessagesToQueue).toHaveBeenCalledTimes(1)
    expect(messageService.addMessagesToQueue).toHaveBeenCalledWith([
      committedMessage,
    ])
  })

  it('should flush the messages of a request that has no transaction', async () => {
    const message = createMessage(MessageType.NOTIFICATION)

    // Without a transaction the writes are autocommitted, so the messages are
    // queued right away and flushed when the response ends.
    await givenARequest(async (res) => {
      addMessagesToQueueAfterCommit(undefined, message)

      await res.emit('finish')
    })

    expect(messageService.addMessagesToQueue).toHaveBeenCalledTimes(1)
    expect(messageService.addMessagesToQueue).toHaveBeenCalledWith([message])
  })

  it('should flush to the request that queued the messages when the transaction commits outside its context', async () => {
    const transaction = createTransaction()
    const message = createMessage(MessageType.NOTIFICATION)

    // Bound before the request starts, so it runs with no message store in
    // scope - the way a commit driven from outside the request would.
    const commitOutsideTheRequest = AsyncResource.bind(() => {
      transaction.commit()
    })

    await givenARequest(async (res) => {
      addMessagesToQueueAfterCommit(transaction, message)
      commitOutsideTheRequest()

      await res.emit('finish')
    })

    expect(messageService.addMessagesToQueue).toHaveBeenCalledTimes(1)
    expect(messageService.addMessagesToQueue).toHaveBeenCalledWith([message])
  })

  it('should throw outside a request, before anything is registered', () => {
    const transaction: AfterCommitTransaction = { afterCommit: jest.fn() }

    expect(() =>
      addMessagesToQueueAfterCommit(
        transaction,
        createMessage(MessageType.NOTIFICATION),
      ),
    ).toThrow(InternalServerErrorException)
    expect(transaction.afterCommit).not.toHaveBeenCalled()
  })

  it('should throw outside a request when there is no transaction', () => {
    expect(() =>
      addMessagesToQueueAfterCommit(
        undefined,
        createMessage(MessageType.NOTIFICATION),
      ),
    ).toThrow(InternalServerErrorException)
  })

  describe('addMessagesToQueue', () => {
    // Pins the behaviour the unmigrated call sites keep: the messages are
    // flushed whether or not the transaction they were queued in commits.
    it('should flush the messages of a transaction that rolls back', async () => {
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
})
