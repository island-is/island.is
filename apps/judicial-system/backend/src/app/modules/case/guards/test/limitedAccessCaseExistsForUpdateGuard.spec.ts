import type { Transaction } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import { v4 as uuid } from 'uuid'

import {
  BadRequestException,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common'

import { type User, UserRole } from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../../test/createTestingCaseModule'

import { runInRequestContext } from '../../../../test'
import { CaseRepositoryService } from '../../../repository'
import { LimitedAccessCaseExistsForUpdateGuard } from '../limitedAccessCaseExistsForUpdate.guard'

interface Then {
  result: boolean
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('Limited Access Case Exists For Update Guard', () => {
  const transaction = {} as Transaction
  const mockRequest = jest.fn()
  let mockCaseRepositoryService: CaseRepositoryService
  let mockSequelize: Sequelize
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { caseRepositoryService, limitedAccessCaseService, sequelize } =
      await createTestingCaseModule()

    mockCaseRepositoryService = caseRepositoryService
    mockSequelize = sequelize

    const mockTransaction = mockSequelize.transaction as jest.Mock
    mockTransaction.mockResolvedValue(transaction)

    givenWhenThen = async (): Promise<Then> => {
      const guard = new LimitedAccessCaseExistsForUpdateGuard(
        limitedAccessCaseService,
        mockSequelize,
      )
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

  describe('case exists for a defence user', () => {
    const caseId = uuid()
    const theCase = { id: caseId }
    const user = {
      nationalId: '1234567890',
      role: UserRole.DEFENDER,
    } as User
    const request = {
      params: { caseId },
      case: undefined,
      user: { currentUser: user },
    }
    let then: Then

    beforeEach(async () => {
      mockRequest.mockReturnValueOnce(request)
      const mockFindLimitedAccessByIdForUpdate =
        mockCaseRepositoryService.findLimitedAccessByIdForUpdate as jest.Mock
      mockFindLimitedAccessByIdForUpdate.mockResolvedValueOnce(theCase)

      then = await givenWhenThen()
    })

    it('should read the case, narrowed to the defence user, in the request transaction and activate', () => {
      expect(mockSequelize.transaction).toHaveBeenCalledTimes(1)
      expect(
        mockCaseRepositoryService.findLimitedAccessByIdForUpdate,
      ).toHaveBeenCalledWith(caseId, {
        defenceUserNationalId: user.nationalId,
        transaction,
      })
      expect(then.result).toBe(true)
      expect(request.case).toBe(theCase)
    })
  })

  describe('case exists for a prison system user', () => {
    const caseId = uuid()
    const theCase = { id: caseId }
    const user = {
      nationalId: '1234567890',
      role: UserRole.PRISON_SYSTEM_STAFF,
    } as User
    const request = {
      params: { caseId },
      case: undefined,
      user: { currentUser: user },
    }
    let then: Then

    beforeEach(async () => {
      mockRequest.mockReturnValueOnce(request)
      const mockFindLimitedAccessByIdForUpdate =
        mockCaseRepositoryService.findLimitedAccessByIdForUpdate as jest.Mock
      mockFindLimitedAccessByIdForUpdate.mockResolvedValueOnce(theCase)

      then = await givenWhenThen()
    })

    it('should read the case without narrowing it and activate', () => {
      expect(
        mockCaseRepositoryService.findLimitedAccessByIdForUpdate,
      ).toHaveBeenCalledWith(caseId, {
        defenceUserNationalId: undefined,
        transaction,
      })
      expect(then.result).toBe(true)
      expect(request.case).toBe(theCase)
    })
  })

  describe('case does not exist', () => {
    const caseId = uuid()
    let then: Then

    beforeEach(async () => {
      mockRequest.mockReturnValueOnce({ params: { caseId } })
      const mockFindLimitedAccessByIdForUpdate =
        mockCaseRepositoryService.findLimitedAccessByIdForUpdate as jest.Mock
      mockFindLimitedAccessByIdForUpdate.mockResolvedValueOnce(null)

      then = await givenWhenThen()
    })

    it('should throw NotFoundException', () => {
      expect(then.error).toBeInstanceOf(NotFoundException)
      expect(then.error.message).toBe(`Case ${caseId} does not exist`)
    })
  })

  describe('missing case id', () => {
    let then: Then

    beforeEach(async () => {
      mockRequest.mockReturnValueOnce({ params: {} })

      then = await givenWhenThen()
    })

    it('should throw BadRequestException without opening a transaction', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error.message).toBe('Missing case id')
      expect(mockSequelize.transaction).not.toHaveBeenCalled()
      expect(
        mockCaseRepositoryService.findLimitedAccessByIdForUpdate,
      ).not.toHaveBeenCalled()
    })
  })
})
