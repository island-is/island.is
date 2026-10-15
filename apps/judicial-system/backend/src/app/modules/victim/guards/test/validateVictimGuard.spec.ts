import type { Transaction } from 'sequelize'
import type { Sequelize } from 'sequelize-typescript'
import { v4 as uuid } from 'uuid'

import {
  BadRequestException,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common'

import { runInRequestContext } from '../../../../test'
import { VictimService } from '../../victim.service'
import { ValidateVictimGuard } from '../validateVictim.guard'

interface Then {
  result?: boolean
  error?: Error
}

type GivenWhenThen = () => Promise<Then>

describe('Validate Victim Guard', () => {
  const transaction = {} as Transaction

  let mockRequest: jest.Mock
  let mockFindById: jest.Mock
  let mockTransaction: jest.Mock
  let guard: ValidateVictimGuard
  let givenWhenThen: GivenWhenThen

  beforeEach(() => {
    mockRequest = jest.fn()
    mockFindById = jest.fn()
    mockTransaction = jest.fn().mockResolvedValue(transaction)

    guard = new ValidateVictimGuard(
      { findById: mockFindById } as unknown as VictimService,
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

  describe('victim belongs to the case', () => {
    const caseId = uuid()
    const victimId = uuid()
    const victim = { id: victimId, caseId }
    const request = {
      params: { caseId, victimId },
      case: { id: caseId },
      victim: undefined,
    }

    let then: Then

    beforeEach(async () => {
      mockRequest.mockReturnValue(request)
      mockFindById.mockResolvedValue(victim)

      then = await givenWhenThen()
    })

    it('should read the victim in the request transaction and activate', () => {
      expect(mockFindById).toHaveBeenCalledWith(victimId, { transaction })
      expect(then.result).toBe(true)
      expect(request.victim).toBe(victim)
    })
  })

  describe('victim belongs to another case', () => {
    const caseId = uuid()
    const victimId = uuid()

    let then: Then

    beforeEach(async () => {
      mockRequest.mockReturnValue({
        params: { caseId, victimId },
        case: { id: caseId },
      })
      mockFindById.mockResolvedValue({ id: victimId, caseId: uuid() })

      then = await givenWhenThen()
    })

    it('should throw BadRequestException', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error?.message).toBe('Victim does not belong to case')
    })
  })

  describe('victim does not exist', () => {
    const caseId = uuid()
    const victimId = uuid()

    let then: Then

    beforeEach(async () => {
      mockRequest.mockReturnValue({
        params: { caseId, victimId },
        case: { id: caseId },
      })
      mockFindById.mockRejectedValue(
        new NotFoundException(`Victim ${victimId} not found`),
      )

      then = await givenWhenThen()
    })

    it('should let the service NotFoundException through', () => {
      expect(then.error).toBeInstanceOf(NotFoundException)
      expect(then.error?.message).toBe(`Victim ${victimId} not found`)
    })
  })

  describe('no victim id on the route', () => {
    const caseId = uuid()

    let then: Then

    beforeEach(async () => {
      mockRequest.mockReturnValue({ params: { caseId }, case: { id: caseId } })

      then = await givenWhenThen()
    })

    it('should activate without touching the transaction', () => {
      expect(then.result).toBe(true)
      expect(mockTransaction).not.toHaveBeenCalled()
      expect(mockFindById).not.toHaveBeenCalled()
    })
  })

  describe('missing case', () => {
    const victimId = uuid()

    let then: Then

    beforeEach(async () => {
      mockRequest.mockReturnValue({ params: { victimId } })

      then = await givenWhenThen()
    })

    it('should throw BadRequestException without touching the transaction', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error?.message).toBe('Missing case')
      expect(mockTransaction).not.toHaveBeenCalled()
      expect(mockFindById).not.toHaveBeenCalled()
    })
  })
})
