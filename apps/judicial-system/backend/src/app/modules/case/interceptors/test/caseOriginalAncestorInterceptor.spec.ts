import type { Transaction } from 'sequelize'
import type { Sequelize } from 'sequelize-typescript'

import {
  CallHandler,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common'

import { getOrCreateTransaction } from '../../../../middleware'
import { runInRequestContext } from '../../../../test'
import { Case, CaseRepositoryService } from '../../../repository'
import { CaseOriginalAncestorInterceptor } from '../caseOriginalAncestor.interceptor'

interface Then {
  result: unknown
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('Case Original Ancestor Interceptor', () => {
  const mockFindOriginalAncestor = jest.fn()
  const mockRequest = jest.fn()
  const mockHandle = jest.fn()
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    givenWhenThen = async (): Promise<Then> => {
      const interceptor = new CaseOriginalAncestorInterceptor({
        findOriginalAncestor: mockFindOriginalAncestor,
      } as unknown as CaseRepositoryService)
      const then = {} as Then

      await interceptor
        .intercept(
          {
            switchToHttp: () => ({ getRequest: mockRequest }),
          } as unknown as ExecutionContext,
          { handle: mockHandle } as unknown as CallHandler,
        )
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('original ancestor lookup', () => {
    const theCase = {} as Case

    beforeEach(async () => {
      mockRequest.mockImplementationOnce(() => ({ case: theCase }))

      await givenWhenThen()
    })

    it('should request the original ancestor without a transaction', () => {
      // Outside a request there is no request transaction to join.
      expect(mockFindOriginalAncestor).toHaveBeenCalledWith(theCase, {
        transaction: undefined,
      })
    })
  })

  describe('original ancestor lookup on a route with a request transaction', () => {
    const theCase = {} as Case
    const transaction = {} as Transaction
    const sequelize = {
      transaction: jest.fn().mockResolvedValue(transaction),
    } as unknown as Sequelize

    beforeEach(async () => {
      mockRequest.mockImplementationOnce(() => ({ case: theCase }))

      // The guard that locked the case row opened the request transaction
      // before the interceptor runs; guards do not run here, so it is set up
      // by hand.
      await runInRequestContext(async () => {
        await getOrCreateTransaction(sequelize)

        await givenWhenThen()
      })
    })

    it('should read the original ancestor in the request transaction', () => {
      expect(mockFindOriginalAncestor).toHaveBeenCalledWith(theCase, {
        transaction,
      })
      expect(sequelize.transaction).toHaveBeenCalledTimes(1)
    })
  })

  describe('next call', () => {
    const theCase = {} as Case
    const request = { case: theCase }
    const result = {}
    let then: Then

    beforeEach(async () => {
      mockRequest.mockImplementationOnce(() => request)
      mockHandle.mockReturnValueOnce(result)

      then = await givenWhenThen()
    })

    it('should not change request case', () => {
      expect(then.result).toBe(result)
    })
  })

  describe('case has no ancestor', () => {
    const theCase = {} as Case
    const request = { case: theCase }

    beforeEach(async () => {
      mockRequest.mockImplementationOnce(() => request)
      mockFindOriginalAncestor.mockResolvedValueOnce(theCase)

      await givenWhenThen()
    })

    it('should not change request case', () => {
      expect(request.case).toBe(theCase)
    })
  })

  describe('missing case', () => {
    let then: Then

    beforeEach(async () => {
      mockRequest.mockImplementationOnce(() => ({}))

      then = await givenWhenThen()
    })

    it('should activate', () => {
      expect(then.error).toBeInstanceOf(InternalServerErrorException)
      expect(then.error.message).toBe('Missing case')
    })
  })
})
