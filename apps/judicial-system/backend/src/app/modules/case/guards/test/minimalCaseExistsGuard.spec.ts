import { v4 as uuid } from 'uuid'

import {
  BadRequestException,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common'

import { createTestingCaseModule } from '../../test/createTestingCaseModule'

import { Case, CaseRepositoryService } from '../../../repository'
import { MinimalCaseExistsGuard } from '../minimalCaseExists.guard'

interface Then {
  result: boolean
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('Minimal Case Exists Guard', () => {
  const mockRequest = jest.fn()
  let mockCaseRepositoryService: CaseRepositoryService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { caseRepositoryService, caseService } =
      await createTestingCaseModule()

    mockCaseRepositoryService = caseRepositoryService

    givenWhenThen = async (): Promise<Then> => {
      const guard = new MinimalCaseExistsGuard(caseService)
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
    const theCase = { id: caseId } as Case
    const request = { params: { caseId }, case: undefined }
    let then: Then

    beforeEach(async () => {
      mockRequest.mockReturnValueOnce(request)
      const mockFindLiveMinimalById =
        mockCaseRepositoryService.findLiveMinimalById as jest.Mock
      mockFindLiveMinimalById.mockResolvedValueOnce(theCase)

      then = await givenWhenThen()
    })

    it('should read the case row without a transaction and activate', () => {
      expect(
        mockCaseRepositoryService.findLiveMinimalById,
      ).toHaveBeenCalledWith(caseId)
      expect(then.result).toBe(true)
      expect(request.case).toBe(theCase)
    })
  })

  describe('case does not exist', () => {
    const caseId = uuid()
    let then: Then

    beforeEach(async () => {
      mockRequest.mockReturnValueOnce({ params: { caseId } })
      const mockFindLiveMinimalById =
        mockCaseRepositoryService.findLiveMinimalById as jest.Mock
      mockFindLiveMinimalById.mockResolvedValueOnce(null)

      then = await givenWhenThen()
    })

    it('should throw NotFoundException', () => {
      expect(then.error).toBeInstanceOf(NotFoundException)
      expect(then.error.message).toBe(`Case ${caseId} not found`)
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

  describe('malformed case id', () => {
    let then: Then

    beforeEach(async () => {
      mockRequest.mockReturnValueOnce({ params: { caseId: 'not-a-uuid' } })

      then = await givenWhenThen()
    })

    it('should throw BadRequestException without reading', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error.message).toBe('Invalid case id format')
      expect(
        mockCaseRepositoryService.findLiveMinimalById,
      ).not.toHaveBeenCalled()
    })
  })
})
