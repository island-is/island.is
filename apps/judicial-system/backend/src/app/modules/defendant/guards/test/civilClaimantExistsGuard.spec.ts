import { v4 as uuid } from 'uuid'

import {
  BadRequestException,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common'

import { CivilClaimantExistsGuard } from '../civilClaimantExists.guard'

interface Then {
  result: boolean
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('Civil Claimant Exists Guard', () => {
  const mockRequest = jest.fn()
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    givenWhenThen = async (): Promise<Then> => {
      const guard = new CivilClaimantExistsGuard()
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

  describe('civil claimant exists', () => {
    const caseId = uuid()
    const civilClaimantId = uuid()
    const civilClaimant = { id: civilClaimantId, caseId }
    const theCase = { id: caseId, civilClaimants: [civilClaimant] }
    const request = {
      params: { caseId, civilClaimantId },
      case: theCase,
      civilClaimant: undefined,
    }
    let then: Then

    beforeEach(async () => {
      mockRequest.mockReturnValueOnce(request)

      then = await givenWhenThen()
    })

    it('should activate', () => {
      expect(then.result).toBe(true)
      expect(request.civilClaimant).toBe(civilClaimant)
    })
  })

  describe('civil claimant does not exist', () => {
    const caseId = uuid()
    const civilClaimantId = uuid()
    const theCase = { id: caseId, civilClaimants: [] }
    let then: Then

    beforeEach(async () => {
      mockRequest.mockReturnValueOnce({
        params: { caseId, civilClaimantId },
        case: theCase,
      })

      then = await givenWhenThen()
    })

    it('should throw NotFoundException', () => {
      expect(then.error).toBeInstanceOf(NotFoundException)
      expect(then.error.message).toBe(
        `Civil claimant ${civilClaimantId} of case ${caseId} does not exist`,
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

  describe('missing civil claimant id', () => {
    const caseId = uuid()
    const theCase = { id: caseId, civilClaimants: [] }
    let then: Then

    beforeEach(async () => {
      mockRequest.mockReturnValueOnce({ params: { caseId }, case: theCase })

      then = await givenWhenThen()
    })

    it('should throw BadRequestException', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error.message).toBe('Missing civil claimant id')
    })
  })
})
