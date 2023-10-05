import {
  ExecutionContext,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common'

import {
  CaseState,
  completedCaseStates,
  RequestSharedWithDefender,
} from '@island.is/judicial-system/types'

import { RequestSharedWithDefenderGuard } from '../requestSharedWithDefender.guard'

interface Then {
  result: boolean
  error: Error
}

type GivenWhenThen = () => Then

describe('Request Shared With Defender Guard', () => {
  const mockRequest = jest.fn()
  let givenWhenThen: GivenWhenThen

  beforeEach(() => {
    givenWhenThen = (): Then => {
      const guard = new RequestSharedWithDefenderGuard()
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

  describe.each([
    CaseState.SUBMITTED,
    CaseState.RECEIVED,
    ...completedCaseStates,
  ])('request shared with defender when ready for court', (state) => {
    let then: Then

    beforeEach(() => {
      mockRequest.mockImplementationOnce(() => ({
        case: {
          state,
          requestSharedWithDefender: RequestSharedWithDefender.READY_FOR_COURT,
        },
      }))

      then = givenWhenThen()
    })

    it(`${state} should activate`, () => {
      expect(then.result).toBe(true)
    })
  })

  describe.each([CaseState.RECEIVED, ...completedCaseStates])(
    'request shared with defender and court date has been set',
    (state) => {
      let then: Then

      beforeEach(() => {
        mockRequest.mockImplementationOnce(() => ({
          case: {
            state,
            requestSharedWithDefender: RequestSharedWithDefender.COURT_DATE,
            courtDate: new Date(),
          },
        }))

        then = givenWhenThen()
      })

      it(`${state} should activate`, () => {
        expect(then.result).toBe(true)
      })
    },
  )

  describe('request shared with defender at court date, but court date has not been set', () => {
    let then: Then

    beforeEach(() => {
      mockRequest.mockImplementationOnce(() => ({
        case: {
          state: CaseState.RECEIVED,
          requestSharedWithDefender: RequestSharedWithDefender.COURT_DATE,
        },
      }))

      then = givenWhenThen()
    })

    it('should throw ForbiddenException', () => {
      expect(then.error).toBeInstanceOf(ForbiddenException)
      expect(then.error.message).toBe(
        'Forbidden when request is not shared with defender',
      )
    })
  })

  describe('request not shared with defender', () => {
    let then: Then

    beforeEach(() => {
      mockRequest.mockImplementationOnce(() => ({
        case: {},
      }))

      then = givenWhenThen()
    })

    it('should throw ForbiddenException', () => {
      expect(then.error).toBeInstanceOf(ForbiddenException)
      expect(then.error.message).toBe(
        'Forbidden when request is not shared with defender',
      )
    })
  })

  describe('missing case', () => {
    let then: Then

    beforeEach(() => {
      mockRequest.mockImplementationOnce(() => ({}))

      then = givenWhenThen()
    })

    it('should throw InternalServerErrorException', () => {
      expect(then.error).toBeInstanceOf(InternalServerErrorException)
      expect(then.error.message).toBe('Missing case')
    })
  })
})
