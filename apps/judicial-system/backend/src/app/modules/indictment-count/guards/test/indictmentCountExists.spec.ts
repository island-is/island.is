import type { Transaction } from 'sequelize'
import type { Sequelize } from 'sequelize-typescript'
import { v4 as uuid } from 'uuid'

import {
  BadRequestException,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common'

import { runInRequestContext } from '../../../../test'
import { IndictmentCountService } from '../../indictmentCount.service'
import { IndictmentCountExistsGuard } from '../indictmentCountExists.guard'

interface Then {
  result?: boolean
  error?: Error
}

type GivenWhenThen = () => Promise<Then>

describe('Indictment Count Exists Guard', () => {
  const transaction = {} as Transaction

  let mockRequest: jest.Mock
  let mockFindById: jest.Mock
  let mockTransaction: jest.Mock
  let mockIndictmentCountService: Partial<IndictmentCountService>
  let guard: IndictmentCountExistsGuard
  let givenWhenThen: GivenWhenThen

  beforeEach(() => {
    mockRequest = jest.fn()
    mockFindById = jest.fn()
    mockTransaction = jest.fn().mockResolvedValue(transaction)

    mockIndictmentCountService = {
      findById: mockFindById,
    }

    guard = new IndictmentCountExistsGuard(
      mockIndictmentCountService as IndictmentCountService,
      { transaction: mockTransaction } as unknown as Sequelize,
    )

    givenWhenThen = async (): Promise<Then> => {
      const then = {} as Then

      try {
        then.result = await runInRequestContext(() =>
          guard.canActivate({
            switchToHttp: () => ({ getRequest: mockRequest }),
          } as unknown as ExecutionContext),
        )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('indictment count exists', () => {
    const caseId = uuid()
    const indictmentCountId = uuid()
    const indictmentCount = { id: indictmentCountId, caseId }
    const theCase = { id: caseId }
    const request = {
      params: { caseId, indictmentCountId },
      case: theCase,
      indictmentCount: undefined,
    }

    let then: Then

    beforeEach(async () => {
      mockRequest.mockReturnValue(request)
      mockFindById.mockResolvedValue(indictmentCount)

      then = await givenWhenThen()
    })

    it('should read the count in the request transaction and activate', () => {
      expect(mockFindById).toHaveBeenCalledWith(indictmentCountId, {
        transaction,
      })
      expect(then.result).toBe(true)
      expect(request.indictmentCount).toBe(indictmentCount)
    })
  })

  describe('indictment count belongs to another case', () => {
    const caseId = uuid()
    const indictmentCountId = uuid()

    let then: Then

    beforeEach(async () => {
      mockRequest.mockReturnValue({
        params: { caseId, indictmentCountId },
        case: { id: caseId },
      })
      mockFindById.mockResolvedValue({ id: indictmentCountId, caseId: uuid() })

      then = await givenWhenThen()
    })

    it('should throw NotFoundException', () => {
      expect(then.error).toBeInstanceOf(NotFoundException)
      expect(then.error?.message).toBe(
        `Indictment count ${indictmentCountId} of case ${caseId} does not exist`,
      )
    })
  })

  describe('indictment count does not exist', () => {
    const caseId = uuid()
    const indictmentCountId = uuid()
    const theCase = { id: caseId }

    let then: Then

    beforeEach(async () => {
      mockRequest.mockReturnValue({
        params: { caseId, indictmentCountId },
        case: theCase,
      })
      mockFindById.mockResolvedValue(null)

      then = await givenWhenThen()
    })

    it('should throw NotFoundException', () => {
      expect(then.error).toBeInstanceOf(NotFoundException)
      expect(then.error?.message).toBe(
        `Indictment count ${indictmentCountId} of case ${caseId} does not exist`,
      )
    })
  })

  describe('missing case', () => {
    let then: Then

    beforeEach(async () => {
      mockRequest.mockReturnValue({ params: {} })

      then = await givenWhenThen()
    })

    it('should throw BadRequestException without touching the transaction', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error?.message).toBe('Missing case')
      expect(mockTransaction).not.toHaveBeenCalled()
      expect(mockFindById).not.toHaveBeenCalled()
    })
  })

  describe('missing indictment count id', () => {
    const caseId = uuid()
    const theCase = { id: caseId }

    let then: Then

    beforeEach(async () => {
      mockRequest.mockReturnValue({ params: { caseId }, case: theCase })

      then = await givenWhenThen()
    })

    it('should throw BadRequestException without touching the transaction', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error?.message).toBe('Missing indictment count id')
      expect(mockTransaction).not.toHaveBeenCalled()
      expect(mockFindById).not.toHaveBeenCalled()
    })
  })
})
