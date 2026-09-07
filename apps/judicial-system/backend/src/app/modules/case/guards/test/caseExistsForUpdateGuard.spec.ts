import type { Transaction } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import { v4 as uuid } from 'uuid'

import {
  BadRequestException,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common'

import { createTestingCaseModule } from '../../test/createTestingCaseModule'

import { runInRequestContext } from '../../../../test'
import { Case, CaseRepositoryService } from '../../../repository'
import { CaseExistsForUpdateGuard } from '../caseExistsForUpdate.guard'

interface Then {
  result: boolean
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('Case Exists For Update Guard', () => {
  const transaction = {} as Transaction
  const mockRequest = jest.fn()
  let mockCaseRepositoryService: CaseRepositoryService
  let mockSequelize: Sequelize
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { caseRepositoryService, caseService, sequelize } =
      await createTestingCaseModule()

    mockCaseRepositoryService = caseRepositoryService
    mockSequelize = sequelize

    const mockTransaction = mockSequelize.transaction as jest.Mock
    mockTransaction.mockResolvedValue(transaction)

    givenWhenThen = async (): Promise<Then> => {
      const guard = new CaseExistsForUpdateGuard(caseService, mockSequelize)
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

  describe('case exists', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const request = { params: { caseId }, case: undefined }
    let then: Then

    beforeEach(async () => {
      mockRequest.mockReturnValueOnce(request)
      const mockFindLiveByIdForUpdate =
        mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
      mockFindLiveByIdForUpdate.mockResolvedValueOnce(theCase)

      then = await givenWhenThen()
    })

    it('should read the case in the request transaction and activate', () => {
      expect(mockSequelize.transaction).toHaveBeenCalledTimes(1)
      expect(
        mockCaseRepositoryService.findLiveByIdForUpdate,
      ).toHaveBeenCalledWith(caseId, transaction)
      expect(then.result).toBe(true)
      expect(request.case).toBe(theCase)
    })
  })

  describe('case does not exist', () => {
    const caseId = uuid()
    let then: Then

    beforeEach(async () => {
      mockRequest.mockReturnValueOnce({ params: { caseId } })
      const mockFindLiveByIdForUpdate =
        mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
      mockFindLiveByIdForUpdate.mockResolvedValueOnce(null)

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
    })
  })
})
