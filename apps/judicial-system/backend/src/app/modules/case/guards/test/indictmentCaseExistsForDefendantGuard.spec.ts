import { v4 as uuid } from 'uuid'

import {
  BadRequestException,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common'

import { createTestingCaseModule } from '../../test/createTestingCaseModule'

import { CaseRepositoryService } from '../../../repository'
import { IndictmentCaseExistsForDefendantGuard } from '../indictmentCaseExistsForDefendant.guard'

interface Then {
  result: boolean
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('Indictment Case Exists For Defendant Guard', () => {
  const mockRequest = jest.fn()
  let mockCaseRepositoryService: CaseRepositoryService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { caseRepositoryService, internalCaseService } =
      await createTestingCaseModule()

    mockCaseRepositoryService = caseRepositoryService

    givenWhenThen = async (): Promise<Then> => {
      const guard = new IndictmentCaseExistsForDefendantGuard(
        internalCaseService,
      )
      const then = {} as Then

      try {
        then.result = await guard.canActivate({
          switchToHttp: () => ({ getRequest: mockRequest }),
        } as unknown as ExecutionContext)
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('case exists', () => {
    const caseId = uuid()
    const defendantNationalId = uuid()
    const theCase = { id: caseId }
    const request = { params: { caseId, defendantNationalId }, case: undefined }
    let then: Then

    beforeEach(async () => {
      mockRequest.mockReturnValueOnce(request)
      const mockFindIndictmentCase =
        mockCaseRepositoryService.findIndictmentCaseByIdAndDefendantNationalId as jest.Mock
      mockFindIndictmentCase.mockResolvedValueOnce(theCase)

      then = await givenWhenThen()
    })

    it('should activate', () => {
      expect(
        mockCaseRepositoryService.findIndictmentCaseByIdAndDefendantNationalId,
      ).toHaveBeenCalledWith(caseId, defendantNationalId)
      expect(then.result).toBe(true)
      expect(request.case).toBe(theCase)
    })
  })

  describe('case does not exist', () => {
    const caseId = uuid()
    const defendantNationalId = uuid()
    let then: Then

    beforeEach(async () => {
      mockRequest.mockReturnValueOnce({
        params: { caseId, defendantNationalId },
      })

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

    it('should throw BadRequestException', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error.message).toBe('Missing case id')
    })
  })

  describe('missing defendant national id', () => {
    const caseId = uuid()
    let then: Then

    beforeEach(async () => {
      mockRequest.mockReturnValueOnce({ params: { caseId } })

      then = await givenWhenThen()
    })

    it('should throw BadRequestException', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error.message).toBe('Missing defendant national id')
    })
  })
})
