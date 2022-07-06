import { uuid } from 'uuidv4'

import {
  BadRequestException,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common'

import { createTestingDefendantModule } from '../../test/createTestingDefendantModule'
import { Defendant } from '../../models/defendant.model'
import { DefendantExistsGuard } from '../defendantExists.guard'

interface Then {
  result: boolean
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('Defendant Exists Guard', () => {
  const mockRequest = jest.fn()
  let mockDefendantModel: typeof Defendant
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      defendantModel,
      defendantService,
    } = await createTestingDefendantModule()

    mockDefendantModel = defendantModel

    givenWhenThen = async (): Promise<Then> => {
      const guard = new DefendantExistsGuard(defendantService)
      const then = {} as Then

      try {
        then.result = await guard.canActivate(({
          switchToHttp: () => ({ getRequest: mockRequest }),
        } as unknown) as ExecutionContext)
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('database lookup', () => {
    const caseId = uuid()
    const defendantId = uuid()

    beforeEach(async () => {
      mockRequest.mockImplementationOnce(() => ({
        params: { caseId, defendantId },
      }))

      await givenWhenThen()
    })

    it('should query the database', () => {
      expect(mockDefendantModel.findOne).toHaveBeenCalledWith({
        where: {
          id: defendantId,
          caseId,
        },
      })
    })
  })

  describe('defendant exists', () => {
    const caseId = uuid()
    const defendantId = uuid()
    const defendant = { id: defendantId, caseId }
    let then: Then

    beforeEach(async () => {
      mockRequest.mockImplementationOnce(() => ({
        params: { caseId, defendantId },
      }))
      const mockFindOne = mockDefendantModel.findOne as jest.Mock
      mockFindOne.mockResolvedValueOnce(defendant)

      then = await givenWhenThen()
    })

    it('should activate', () => {
      expect(then.result).toBe(true)
    })
  })

  describe('defendant does not exist', () => {
    const caseId = uuid()
    const defendantId = uuid()
    let then: Then

    beforeEach(async () => {
      mockRequest.mockImplementationOnce(() => ({
        params: { caseId, defendantId },
      }))

      then = await givenWhenThen()
    })

    it('should throw NotFoundException', () => {
      expect(then.error).toBeInstanceOf(NotFoundException)
      expect(then.error.message).toBe(
        `Defendant ${defendantId} of case ${caseId} does not exist`,
      )
    })
  })

  describe('missing case id', () => {
    let then: Then

    beforeEach(async () => {
      mockRequest.mockImplementationOnce(() => ({ params: {} }))

      then = await givenWhenThen()
    })

    it('should throw BadRequestException', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error.message).toBe('Missing case id')
    })
  })

  describe('missing defendant id', () => {
    const caseId = uuid()
    let then: Then

    beforeEach(async () => {
      mockRequest.mockImplementationOnce(() => ({ params: { caseId } }))

      then = await givenWhenThen()
    })

    it('should throw BadRequestException', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error.message).toBe('Missing defendant id')
    })
  })
})
