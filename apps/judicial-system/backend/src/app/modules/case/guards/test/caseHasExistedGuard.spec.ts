import { uuid } from 'uuidv4'

import {
  BadRequestException,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common'

import { createTestingCaseModule } from '../../test/createTestingCaseModule'

import { include } from '../../case.service'
import { Case } from '../../models/case.model'
import { CaseHasExistedGuard } from '../caseHasExisted.guard'

interface Then {
  result: boolean
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('Case Has Existed Guard', () => {
  const mockRequest = jest.fn()
  let mockCaseModel: typeof Case
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { caseModel, caseService } = await createTestingCaseModule()

    mockCaseModel = caseModel

    givenWhenThen = async (): Promise<Then> => {
      const guard = new CaseHasExistedGuard(caseService)
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

  describe('case has existed', () => {
    const caseId = uuid()
    const theCase = { id: caseId }
    const request = { params: { caseId }, case: undefined }
    let then: Then

    beforeEach(async () => {
      mockRequest.mockReturnValueOnce(request)
      const mockFindOne = mockCaseModel.findOne as jest.Mock
      mockFindOne.mockResolvedValueOnce(theCase)

      then = await givenWhenThen()
    })

    it('should activate', () => {
      expect(mockCaseModel.findOne).toHaveBeenCalledWith({
        include,
        where: {
          id: caseId,
          isArchived: false,
        },
      })
      expect(then.result).toBe(true)
      expect(request.case).toBe(theCase)
    })
  })

  describe('case has not existed', () => {
    const caseId = uuid()
    let then: Then

    beforeEach(async () => {
      mockRequest.mockReturnValueOnce({ params: { caseId } })

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
})
