import { v4 as uuid } from 'uuid'

import {
  BadRequestException,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common'

import { createTestingCaseModule } from '../../test/createTestingCaseModule'

import { MergedCaseExistsGuard } from '../mergedCaseExists.guard'

interface Then {
  result: boolean
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('Merged Case Exists Guard', () => {
  const mockRequest = jest.fn()
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { caseService } = await createTestingCaseModule()

    givenWhenThen = async (): Promise<Then> => {
      const guard = new MergedCaseExistsGuard(caseService)
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

  describe('merged case exists', () => {
    const mergedCaseId = uuid()
    const mergedCase = { id: mergedCaseId }
    const caseId = uuid()
    const theCase = { id: caseId, mergedCases: [mergedCase] }
    const request = {
      params: { caseId, mergedCaseId },
      mergedCaseParent: undefined,
      case: theCase,
    }
    let then: Then

    beforeEach(async () => {
      mockRequest.mockReturnValueOnce(request)

      then = await givenWhenThen()
    })

    it('should activate', () => {
      expect(then.result).toBe(true)
      expect(request.mergedCaseParent).toBe(theCase)
      expect(request.params.caseId).toBe(mergedCaseId)
      expect(request.case).toBe(mergedCase)
    })
  })

  describe('no merged case id', () => {
    const caseId = uuid()
    const theCase = { id: caseId, mergedCases: [] }
    const request = {
      params: { caseId },
      mergedCaseParent: undefined,
      case: theCase,
    }
    let then: Then

    beforeEach(async () => {
      mockRequest.mockReturnValueOnce(request)

      then = await givenWhenThen()
    })

    it('should activate', () => {
      expect(then.result).toBe(true)
      expect(request.mergedCaseParent).toBeUndefined()
      expect(request.params.caseId).toBe(caseId)
      expect(request.case).toBe(theCase)
    })
  })

  describe('merged case not found', () => {
    const mergedCaseId = uuid()
    const caseId = uuid()
    const theCase = { id: caseId, mergedCases: [] }
    const request = {
      params: { caseId, mergedCaseId },
      mergedCaseParent: undefined,
      case: theCase,
    }
    let then: Then

    beforeEach(async () => {
      mockRequest.mockReturnValueOnce(request)

      then = await givenWhenThen()
    })

    it('should throw NotFoundException', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error.message).toBe(`Merged case ${mergedCaseId} not found`)
    })
  })

  describe('missing case', () => {
    let then: Then

    beforeEach(async () => {
      mockRequest.mockReturnValueOnce({ params: { mergedCaseId: uuid() } })

      then = await givenWhenThen()
    })

    it('should throw BadRequestException', () => {
      expect(then.error).toBeInstanceOf(InternalServerErrorException)
      expect(then.error.message).toBe('Missing case')
    })
  })
})
