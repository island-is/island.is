import {
  ExecutionContext,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common'

import {
  CaseState,
  completedCaseStates,
  indictmentCases,
  RequestSharedWithDefender,
} from '@island.is/judicial-system/types'

import { LimitedAccessAccordingToCaseStateGuard } from '../limitedAccessAccordingToCaseState.guard'

interface Then {
  result: boolean
  error: Error
}

type GivenWhenThen = () => Then

describe('Limited Access Case State Guard', () => {
  const mockRequest = jest.fn()
  let givenWhenThen: GivenWhenThen

  beforeEach(() => {
    givenWhenThen = (): Then => {
      const guard = new LimitedAccessAccordingToCaseStateGuard()
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

  describe.each(completedCaseStates)('completed case with state', (state) => {
    let then: Then

    beforeEach(() => {
      mockRequest.mockImplementationOnce(() => ({ case: { state } }))

      then = givenWhenThen()
    })

    it(`${state} should activate`, () => {
      expect(then.result).toBe(true)
    })
  })

  describe('received case with court date', () => {
    let then: Then

    beforeEach(() => {
      mockRequest.mockImplementationOnce(() => ({
        case: {
          state: CaseState.RECEIVED,
          courtDate: new Date(),
        },
      }))

      then = givenWhenThen()
    })

    it('should activate', () => {
      expect(then.result).toBe(true)
    })
  })

  describe('received case without court date and without defender access', () => {
    let then: Then

    beforeEach(() => {
      mockRequest.mockImplementationOnce(() => ({
        case: {
          state: CaseState.RECEIVED,
        },
      }))

      then = givenWhenThen()
    })

    it('should throw ForbiddenException', () => {
      expect(then.error).toBeInstanceOf(ForbiddenException)
      expect(then.error.message).toBe(
        'Forbidden for current status of limited access case',
      )
    })
  })

  describe.each(indictmentCases)('received indictment case', (type) => {
    let then: Then

    beforeEach(() => {
      mockRequest.mockImplementationOnce(() => ({
        case: {
          type,
          state: CaseState.RECEIVED,
        },
      }))

      then = givenWhenThen()
    })

    it('should activate', () => {
      expect(then.result).toBe(true)
    })
  })

  describe.each(
    Object.values(CaseState).filter(
      (state) => ![CaseState.RECEIVED, ...completedCaseStates].includes(state),
    ),
  )('unreceived case with no defender access set', (state) => {
    let then: Then

    beforeEach(() => {
      mockRequest.mockImplementationOnce(() => ({ case: { state } }))

      then = givenWhenThen()
    })

    it('should throw ForbiddenException', () => {
      expect(then.error).toBeInstanceOf(ForbiddenException)
      expect(then.error.message).toBe(
        'Forbidden for current status of limited access case',
      )
    })
  })

  describe('submitted case with defender access set to COURT_DATE', () => {
    let then: Then

    beforeEach(() => {
      mockRequest.mockImplementationOnce(() => ({
        case: {
          state: CaseState.SUBMITTED,
          requestSharedWithDefender: RequestSharedWithDefender.COURT_DATE,
        },
      }))

      then = givenWhenThen()
    })

    it('should throw InternalServerErrorException', () => {
      expect(then.error).toBeInstanceOf(ForbiddenException)
      expect(then.error.message).toBe(
        'Forbidden for current status of limited access case',
      )
    })
  })

  describe('submitted case with defender access set to READY_FOR_COURT', () => {
    let then: Then

    beforeEach(() => {
      mockRequest.mockImplementationOnce(() => ({
        case: {
          state: CaseState.SUBMITTED,
          requestSharedWithDefender: RequestSharedWithDefender.READY_FOR_COURT,
        },
      }))

      then = givenWhenThen()
    })

    it('should activate', () => {
      expect(then.result).toBe(true)
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
