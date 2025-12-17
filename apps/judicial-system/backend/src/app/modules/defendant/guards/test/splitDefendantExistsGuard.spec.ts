import { uuid } from 'uuidv4'

import {
  BadRequestException,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common'

import { SplitDefendantExistsGuard } from '../splitDefendantExists.guard'

interface Then {
  result: boolean
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('Split Defendant Exists Guard', () => {
  const mockRequest = jest.fn()
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    givenWhenThen = async (): Promise<Then> => {
      const guard = new SplitDefendantExistsGuard()
      const then = {} as Then

      try {
        then.result = guard.canActivate({
          switchToHttp: () => ({ getRequest: mockRequest }),
        } as unknown as ExecutionContext)
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('defendant exists', () => {
    const caseId = uuid()
    const defendantId = uuid()
    const defendant = { id: defendantId, caseId }
    const theCase = { id: caseId, defendants: [defendant] }
    const request = {
      params: { caseId, defendantId },
      case: theCase,
      defendant: undefined,
    }
    let then: Then

    beforeEach(async () => {
      mockRequest.mockReturnValueOnce(request)

      then = await givenWhenThen()
    })

    it('should activate', () => {
      expect(then.result).toBe(true)
      expect(request.defendant).toBe(defendant)
    })
  })

  describe('defendant exists in split case', () => {
    const caseId = uuid()
    const defendantId = uuid()
    const defendant = { id: defendantId, caseId }
    const theCase = {
      id: caseId,
      defendants: [{ id: uuid() }],
      splitCases: [{ id: uuid(), defendants: [defendant] }],
    }
    const request = {
      params: { caseId, defendantId },
      case: theCase,
      defendant: undefined,
    }
    let then: Then

    beforeEach(async () => {
      mockRequest.mockReturnValueOnce(request)

      then = await givenWhenThen()
    })

    it('should activate', () => {
      expect(then.result).toBe(true)
      expect(request.defendant).toBe(defendant)
    })
  })

  describe('defendant does not exist', () => {
    const caseId = uuid()
    const defendantId = uuid()
    const theCase = {
      id: caseId,
      defendants: [{ id: uuid() }],
      splitCases: [{ id: uuid(), defendants: [{ id: uuid() }] }],
    }
    let then: Then

    beforeEach(async () => {
      mockRequest.mockReturnValueOnce({
        params: { caseId, defendantId },
        case: theCase,
      })

      then = await givenWhenThen()
    })

    it('should throw NotFoundException', () => {
      expect(then.error).toBeInstanceOf(NotFoundException)
      expect(then.error.message).toBe(
        `Defendant ${defendantId} of case ${caseId} does not exist`,
      )
    })
  })

  describe('missing case', () => {
    let then: Then

    beforeEach(async () => {
      mockRequest.mockReturnValueOnce({ params: {} })

      then = await givenWhenThen()
    })

    it('should throw BadRequestException', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error.message).toBe('Missing case')
    })
  })

  describe('missing defendant id', () => {
    const caseId = uuid()
    const theCase = { id: caseId, defendants: [] }
    let then: Then

    beforeEach(async () => {
      mockRequest.mockReturnValueOnce({ params: { caseId }, case: theCase })

      then = await givenWhenThen()
    })

    it('should throw BadRequestException', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error.message).toBe('Missing defendant id')
    })
  })
})
