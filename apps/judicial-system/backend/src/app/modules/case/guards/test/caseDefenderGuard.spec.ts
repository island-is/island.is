import { uuid } from 'uuidv4'

import {
  ExecutionContext,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common'

import { CaseDefenderGuard } from '../caseDefender.guard'

interface Then {
  result: boolean
  error: Error
}

type GivenWhenThen = () => Then

describe('Case Defender Guard', () => {
  const mockRequest = jest.fn()
  let givenWhenThen: GivenWhenThen

  beforeEach(() => {
    givenWhenThen = (): Then => {
      const guard = new CaseDefenderGuard()
      const then = {} as Then

      try {
        then.result = guard.canActivate(({
          switchToHttp: () => ({ getRequest: mockRequest }),
        } as unknown) as ExecutionContext)
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('user is defender', () => {
    let then: Then

    beforeEach(() => {
      mockRequest.mockImplementationOnce(() => ({
        user: {
          nationalId: '123456789',
        },
        case: {
          defenderNationalId: '123456789',
        },
      }))

      then = givenWhenThen()
    })

    it('should activate', () => {
      expect(then.result).toBe(true)
    })
  })

  describe('user is not defender', () => {
    const userId = uuid()
    const caseId = uuid()
    let then: Then

    beforeEach(() => {
      mockRequest.mockImplementationOnce(() => ({
        user: {
          id: userId,
          nationalId: '123456789',
        },
        case: {
          id: caseId,
          defenderNationalId: '987654321',
        },
      }))

      then = givenWhenThen()
    })

    it('should throw ForbiddenException', () => {
      expect(then.error).toBeInstanceOf(ForbiddenException)
      expect(then.error.message).toBe(
        `User ${userId} does not have read access to case ${caseId}`,
      )
    })
  })

  describe('missing user', () => {
    let then: Then

    beforeEach(() => {
      mockRequest.mockImplementationOnce(() => ({}))

      then = givenWhenThen()
    })

    it('should throw InternalServerErrorException', () => {
      expect(then.error).toBeInstanceOf(InternalServerErrorException)
      expect(then.error.message).toBe('Missing user')
    })
  })

  describe('missing case', () => {
    let then: Then

    beforeEach(() => {
      mockRequest.mockImplementationOnce(() => ({ user: {} }))

      then = givenWhenThen()
    })

    it('should throw InternalServerErrorException', () => {
      expect(then.error).toBeInstanceOf(InternalServerErrorException)
      expect(then.error.message).toBe('Missing case')
    })
  })
})
