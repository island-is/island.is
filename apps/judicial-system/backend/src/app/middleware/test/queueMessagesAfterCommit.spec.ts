import type { NextFunction, Request, Response } from 'express'
import { lastValueFrom, of } from 'rxjs'
import { Sequelize } from 'sequelize'
import type { Sequelize as TypedSequelize } from 'sequelize-typescript'

import type { CallHandler, ExecutionContext } from '@nestjs/common'

import type { Logger } from '@island.is/logging'

import {
  Message,
  MessageMiddleware,
  MessageService,
  MessageType,
} from '@island.is/judicial-system/message'

import { TransactionCommitInterceptor } from '../../interceptors'
import { queueMessagesAfterCommit } from '../queueMessagesAfterCommit'
import {
  getOrCreateTransaction,
  TransactionContextMiddleware,
} from '../transactionContext.middleware'

// Drives a real Sequelize 6 transaction, with only its database I/O stubbed,
// through the two middlewares and the interceptor that the app module wires
// around every route: that a message queued for after the commit is flushed
// when the interceptor has committed, that nothing is flushed when the
// middleware rolls back, and that the same holds for a transaction a handler
// owns and commits itself before returning.
describe('messages queued after commit', () => {
  const sequelize = new Sequelize({ dialect: 'postgres', logging: false })
  const queryInterface = sequelize.getQueryInterface()
  const commitTransaction = jest
    .spyOn(queryInterface, 'commitTransaction')
    .mockResolvedValue(undefined)
  const rollbackTransaction = jest
    .spyOn(queryInterface, 'rollbackTransaction')
    .mockResolvedValue(undefined)

  const logger = {
    debug: jest.fn(),
    error: jest.fn(),
  } as unknown as Logger
  const messageService = {
    addMessagesToQueue: jest.fn().mockResolvedValue(undefined),
  } as unknown as MessageService & { addMessagesToQueue: jest.Mock }
  const messageMiddleware = new MessageMiddleware(messageService, logger)
  const transactionMiddleware = new TransactionContextMiddleware(logger)
  const interceptor = new TransactionCommitInterceptor(logger)
  const executionContext = {} as ExecutionContext
  const next: CallHandler = { handle: () => of('some value') }

  const message: Message = {
    type: MessageType.NOTIFICATION,
    caseId: 'some case id',
  }

  // Both middlewares listen for 'close', so the response keeps every listener
  // for an event and runs them in registration order, as a real one does.
  const createResponse = () => {
    const listeners: Record<string, (() => Promise<void> | void)[]> = {}

    return {
      on: (event: string, listener: () => Promise<void> | void) => {
        listeners[event] = [...(listeners[event] ?? []), listener]
      },
      emit: async (event: string) => {
        for (const listener of listeners[event] ?? []) {
          await listener()
        }
      },
    }
  }

  // Runs work inside a request wrapped by both middlewares, in the order the
  // app module applies them. The response is handed to work so that it can
  // end the request from inside the request's own async context and push
  // again afterwards. A completed response ends with 'finish' and then
  // 'close'; an aborted one with 'close' alone.
  const givenARequest = async (
    work: (res: ReturnType<typeof createResponse>) => Promise<void>,
  ) => {
    const res = createResponse()

    let result: Promise<void> | undefined

    messageMiddleware.use(
      {} as Request,
      res as unknown as Response,
      (() => {
        transactionMiddleware.use(
          {} as Request,
          res as unknown as Response,
          (() => {
            result = work(res)
          }) as NextFunction,
        )
      }) as NextFunction,
    )

    await result
  }

  beforeAll(() => {
    jest.spyOn(queryInterface, 'startTransaction').mockResolvedValue(undefined)
    jest.spyOn(queryInterface, 'setIsolationLevel').mockResolvedValue(undefined)
    jest
      .spyOn(sequelize.connectionManager, 'getConnection')
      .mockImplementation(async () => ({}))
    jest
      .spyOn(sequelize.connectionManager, 'releaseConnection')
      .mockImplementation(async () => undefined)
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('on a transaction the request owns', () => {
    it('should flush the messages when the interceptor commits', async () => {
      await givenARequest(async (res) => {
        await getOrCreateTransaction(sequelize as unknown as TypedSequelize)

        queueMessagesAfterCommit(message)

        await lastValueFrom(interceptor.intercept(executionContext, next))

        await res.emit('finish')
        await res.emit('close')
      })

      expect(commitTransaction).toHaveBeenCalledTimes(1)
      expect(rollbackTransaction).not.toHaveBeenCalled()
      expect(messageService.addMessagesToQueue).toHaveBeenCalledTimes(1)
      expect(messageService.addMessagesToQueue).toHaveBeenCalledWith([message])
    })

    it('should flush the messages when the client aborts after the commit', async () => {
      // The response was committed and then aborted before it reached the
      // client: 'close' without 'finish'. The work is durable, so what it has
      // to announce is sent all the same.
      await givenARequest(async (res) => {
        await getOrCreateTransaction(sequelize as unknown as TypedSequelize)

        queueMessagesAfterCommit(message)

        await lastValueFrom(interceptor.intercept(executionContext, next))

        await res.emit('close')
      })

      expect(commitTransaction).toHaveBeenCalledTimes(1)
      expect(rollbackTransaction).not.toHaveBeenCalled()
      expect(messageService.addMessagesToQueue).toHaveBeenCalledTimes(1)
      expect(messageService.addMessagesToQueue).toHaveBeenCalledWith([message])
    })

    it('should flush the messages when the client aborts during the commit', async () => {
      // The client aborts while COMMIT is in flight: the response closes
      // before the after commit callbacks have pushed anything, so the flush
      // on 'close' finds an empty store. The work is durable once the commit
      // comes back, and the message is sent then, once.
      let finishCommit: () => void = () => undefined
      commitTransaction.mockReturnValueOnce(
        new Promise<void>((resolve) => {
          finishCommit = resolve
        }),
      )

      await givenARequest(async (res) => {
        await getOrCreateTransaction(sequelize as unknown as TypedSequelize)

        queueMessagesAfterCommit(message)

        const committing = lastValueFrom(
          interceptor.intercept(executionContext, next),
        )

        await res.emit('close')

        expect(messageService.addMessagesToQueue).not.toHaveBeenCalled()

        finishCommit()

        await committing
      })

      expect(commitTransaction).toHaveBeenCalledTimes(1)
      expect(rollbackTransaction).not.toHaveBeenCalled()
      expect(messageService.addMessagesToQueue).toHaveBeenCalledTimes(1)
      expect(messageService.addMessagesToQueue).toHaveBeenCalledWith([message])
    })

    it('should flush nothing when the middleware rolls back', async () => {
      // No interceptor: the handler failed, so nothing commits and the
      // transaction is still open when the response ends.
      await givenARequest(async (res) => {
        await getOrCreateTransaction(sequelize as unknown as TypedSequelize)

        queueMessagesAfterCommit(message)

        await res.emit('finish')
        await res.emit('close')
      })

      expect(commitTransaction).not.toHaveBeenCalled()
      expect(rollbackTransaction).toHaveBeenCalledTimes(1)
      expect(messageService.addMessagesToQueue).not.toHaveBeenCalled()
    })
  })

  describe('on a transaction the handler owns', () => {
    it('should flush the messages when it commits and the handler returns', async () => {
      await givenARequest(async (res) => {
        await sequelize.transaction(async () => {
          queueMessagesAfterCommit(message)
        })

        // The handler returned, so the interceptor drains the callbacks even
        // though there is no request transaction to commit.
        await lastValueFrom(interceptor.intercept(executionContext, next))

        await res.emit('finish')
        await res.emit('close')
      })

      expect(commitTransaction).toHaveBeenCalledTimes(1)
      expect(messageService.addMessagesToQueue).toHaveBeenCalledTimes(1)
      expect(messageService.addMessagesToQueue).toHaveBeenCalledWith([message])
    })

    it('should flush nothing when it rolls back', async () => {
      // A managed transaction that rolls back rejects, so the handler fails
      // and the interceptor never drains the callbacks.
      await givenARequest(async (res) => {
        await expect(
          sequelize.transaction(async () => {
            queueMessagesAfterCommit(message)

            throw new Error('Some error')
          }),
        ).rejects.toThrow('Some error')

        await res.emit('finish')
        await res.emit('close')
      })

      expect(commitTransaction).not.toHaveBeenCalled()
      expect(rollbackTransaction).toHaveBeenCalledTimes(1)
      expect(messageService.addMessagesToQueue).not.toHaveBeenCalled()
    })
  })

  describe('on a request that opens no transaction', () => {
    it('should flush the messages when the handler returns', async () => {
      await givenARequest(async (res) => {
        queueMessagesAfterCommit(message)

        await lastValueFrom(interceptor.intercept(executionContext, next))

        await res.emit('finish')
        await res.emit('close')
      })

      expect(commitTransaction).not.toHaveBeenCalled()
      expect(messageService.addMessagesToQueue).toHaveBeenCalledWith([message])
    })

    it('should flush the messages when the client aborts before the interceptor runs', async () => {
      // The handler committed a transaction of its own and returned, and the
      // client aborted while a route-level interceptor was still at work, so
      // the response closed before the commit interceptor got to the
      // callbacks. The work is durable, so the message is still sent, once.
      await givenARequest(async (res) => {
        await sequelize.transaction(async () => {
          queueMessagesAfterCommit(message)
        })

        await res.emit('close')

        expect(messageService.addMessagesToQueue).not.toHaveBeenCalled()

        await lastValueFrom(interceptor.intercept(executionContext, next))
      })

      expect(commitTransaction).toHaveBeenCalledTimes(1)
      expect(rollbackTransaction).not.toHaveBeenCalled()
      expect(messageService.addMessagesToQueue).toHaveBeenCalledTimes(1)
      expect(messageService.addMessagesToQueue).toHaveBeenCalledWith([message])
    })
  })
})
