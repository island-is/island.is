import each from 'jest-each'

import {
  ExecutionContext,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common'

import {
  CaseState,
  completedCaseStates,
  indictmentCases,
  investigationCases,
  restrictionCases,
} from '@island.is/judicial-system/types'

import { CaseReceivedForDefenderGuard } from '../caseReceivedForDefender.guard'

interface Then {
  result: boolean
  error: Error
}

type GivenWhenThen = () => Then

describe('Case Received For Defender Guard', () => {
  const mockRequest = jest.fn()
  let givenWhenThen: GivenWhenThen

  beforeEach(() => {
    givenWhenThen = (): Then => {
      const guard = new CaseReceivedForDefenderGuard()
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

  describe.each(completedCaseStates)('completed case', (state) => {
    let then: Then

    beforeEach(() => {
      mockRequest.mockImplementationOnce(() => ({ case: { state } }))

      then = givenWhenThen()
    })

    it('should activate', () => {
      expect(then.result).toBe(true)
    })
  })

  describe.each([...restrictionCases, ...investigationCases])(
    'received R case',
    (type) => {
      describe('with defender access', () => {
        let then: Then

        beforeEach(() => {
          mockRequest.mockImplementationOnce(() => ({
            case: {
              type,
              state: CaseState.RECEIVED,
              courtDate: new Date(),
              sendRequestToDefender: true,
            },
          }))

          then = givenWhenThen()
        })

        it('should activate', () => {
          expect(then.result).toBe(true)
        })
      })

      describe('without court date', () => {
        let then: Then

        beforeEach(() => {
          mockRequest.mockImplementationOnce(() => ({
            case: {
              type,
              state: CaseState.RECEIVED,
              sendRequestToDefender: true,
            },
          }))

          then = givenWhenThen()
        })

        it('should throw ForbiddenException', () => {
          expect(then.error).toBeInstanceOf(ForbiddenException)
          expect(then.error.message).toBe(
            'Forbidden for cases not received for defender',
          )
        })
      })

      describe('without defender access', () => {
        let then: Then

        beforeEach(() => {
          mockRequest.mockImplementationOnce(() => ({
            case: {
              type,
              state: CaseState.RECEIVED,
              courtDate: new Date(),
              sendRequestToDefender: false,
            },
          }))

          then = givenWhenThen()
        })

        it('should throw ForbiddenException', () => {
          expect(then.error).toBeInstanceOf(ForbiddenException)
          expect(then.error.message).toBe(
            'Forbidden for cases not received for defender',
          )
        })
      })
    },
  )

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
  )('unreceived case', (state) => {
    let then: Then

    beforeEach(() => {
      mockRequest.mockImplementationOnce(() => ({ case: { state } }))

      then = givenWhenThen()
    })

    it('should throw ForbiddenException', () => {
      expect(then.error).toBeInstanceOf(ForbiddenException)
      expect(then.error.message).toBe(
        'Forbidden for cases not received for defender',
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
