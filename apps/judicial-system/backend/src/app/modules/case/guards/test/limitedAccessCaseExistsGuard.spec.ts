import { Op } from 'sequelize'
import { uuid } from 'uuidv4'

import {
  BadRequestException,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common'

import { CaseState } from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../../test/createTestingCaseModule'

import { Case } from '../../../repository'
import { attributes, include } from '../../limitedAccessCase.service'
import { LimitedAccessCaseExistsGuard } from '../limitedAccessCaseExists.guard'

interface Then {
  result: boolean
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('Restricted Case Exists Guard', () => {
  const mockRequest = jest.fn()
  let mockCaseModel: typeof Case
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { caseModel, limitedAccessCaseService } =
      await createTestingCaseModule()

    mockCaseModel = caseModel

    givenWhenThen = async (): Promise<Then> => {
      const guard = new LimitedAccessCaseExistsGuard(limitedAccessCaseService)
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
        attributes,
        include,
        where: {
          id: caseId,
          state: { [Op.not]: CaseState.DELETED },
          isArchived: false,
        },
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
