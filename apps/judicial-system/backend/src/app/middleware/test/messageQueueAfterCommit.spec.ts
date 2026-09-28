import type { NextFunction, Request, Response } from 'express'
import { lastValueFrom, of } from 'rxjs'
import { Sequelize } from 'sequelize'
import type { Sequelize as TypedSequelize } from 'sequelize-typescript'

import type { CallHandler, ExecutionContext } from '@nestjs/common'

import type { Logger } from '@island.is/logging'

import {
  addMessagesToQueueAfterCommit,
  Message,
  MessageMiddleware,
  MessageService,
  MessageType,
} from '@island.is/judicial-system/message'

import { TransactionCommitInterceptor } from '../../interceptors'
import {
  getOrCreateTransaction,
  TransactionContextMiddleware,
} from '../transactionContext.middleware'

// Drives a real Sequelize 6 transaction, with only its database I/O stubbed,
// through the two middlewares and the interceptor that the app module wires
// around every route. What is under test is not the message library's own
// spec's fake but Sequelize's after commit hook itself: that the interceptor's
// commit runs it, that the middleware's rollback does not, and that the same
// holds for a transaction a handler owns.
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
    info: jest.fn(),
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

  const createResponse = () => {
    const listeners: Record<string, () => Promise<void> | void> = {}

    return {
      on: (event: string, listener: () => Promise<void> | void) => {
        listeners[event] = listener
      },
      emit: async (event: string) => await listeners[event]?.(),
    }
  }

  // Runs work inside a request wrapped by both middlewares, in the order the
  // app module applies them. The response is handed to work because the
  // events have to be emitted from inside the request's own async context
  // for the message flush to find the request's store, as it does in
  // production. A response ends with 'finish' and then 'close'.
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
        const transaction = await getOrCreateTransaction(
          sequelize as unknown as TypedSequelize,
        )

        addMessagesToQueueAfterCommit(transaction, message)

        await lastValueFrom(interceptor.intercept(executionContext, next))

        await res.emit('finish')
        await res.emit('close')
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
        const transaction = await getOrCreateTransaction(
          sequelize as unknown as TypedSequelize,
        )

        addMessagesToQueueAfterCommit(transaction, message)

        await res.emit('finish')
        await res.emit('close')
      })

      expect(commitTransaction).not.toHaveBeenCalled()
      expect(rollbackTransaction).toHaveBeenCalledTimes(1)
      expect(messageService.addMessagesToQueue).not.toHaveBeenCalled()
    })
  })

  describe('on a transaction the handler owns', () => {
    it('should flush the messages when it commits', async () => {
      await givenARequest(async (res) => {
        await sequelize.transaction(async (transaction) => {
          addMessagesToQueueAfterCommit(transaction, message)
        })

        await res.emit('finish')
        await res.emit('close')
      })

      expect(commitTransaction).toHaveBeenCalledTimes(1)
      expect(messageService.addMessagesToQueue).toHaveBeenCalledTimes(1)
      expect(messageService.addMessagesToQueue).toHaveBeenCalledWith([message])
    })

    it('should flush nothing when it rolls back', async () => {
      await givenARequest(async (res) => {
        await expect(
          sequelize.transaction(async (transaction) => {
            addMessagesToQueueAfterCommit(transaction, message)

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
})
