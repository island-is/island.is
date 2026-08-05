import {
  BadRequestException,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common'

import {
  CaseFileCategory,
  CaseType,
  indictmentCases,
  investigationCases,
  restrictionCases,
  UserRole,
} from '@island.is/judicial-system/types'

import { LimitedAccessCreateCaseFileGuard } from '../limitedAccessCreateCaseFile.guard'

interface Then {
  result: boolean
  error: Error
}

type GivenWhenThen = () => Then

describe('LimitedAccess Create Case File Guard', () => {
  const mockRequest = jest.fn()
  let givenWhenThen: GivenWhenThen

  beforeEach(() => {
    givenWhenThen = (): Then => {
      const guard = new LimitedAccessCreateCaseFileGuard()
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

  describe.each([...restrictionCases, ...investigationCases])(
    'for request case type %s',
    (type) => {
      const allowedCaseFileCategories = [
        CaseFileCategory.DEFENDANT_APPEAL_BRIEF,
        CaseFileCategory.DEFENDANT_APPEAL_BRIEF_CASE_FILE,
        CaseFileCategory.DEFENDANT_APPEAL_STATEMENT,
        CaseFileCategory.DEFENDANT_APPEAL_STATEMENT_CASE_FILE,
        CaseFileCategory.DEFENDANT_APPEAL_CASE_FILE,
      ]

      describe.each(allowedCaseFileCategories)(
        'a defender can create %s',
        (category) => {
          let then: Then

          beforeEach(() => {
            mockRequest.mockImplementationOnce(() => ({
              user: { currentUser: { role: UserRole.DEFENDER } },
              case: { type },
              body: { category },
            }))

            then = givenWhenThen()
          })

          it('should activate', () => {
            expect(then.result).toBe(true)
          })
        },
      )

      describe.each(
        Object.keys(CaseFileCategory).filter(
          (category) =>
            !allowedCaseFileCategories.includes(category as CaseFileCategory),
        ),
      )('a defender can not create %s', (category) => {
        let then: Then

        beforeEach(() => {
          mockRequest.mockImplementationOnce(() => ({
            user: { currentUser: { role: UserRole.DEFENDER } },
            case: { type },
            body: { category },
          }))

          then = givenWhenThen()
        })

        it('should not activate', () => {
          expect(then.result).toBe(false)
        })
      })
    },
  )

  describe.each(indictmentCases)('for indictment case type %s', (type) => {
    const allowedCaseFileCategories = [
      CaseFileCategory.DEFENDANT_CASE_FILE,
      CaseFileCategory.CIVIL_CLAIMANT_SPOKESPERSON_CASE_FILE,
      CaseFileCategory.CIVIL_CLAIMANT_LEGAL_SPOKESPERSON_CASE_FILE,
    ]

    describe.each(allowedCaseFileCategories)(
      'a defender can create %s',
      (category) => {
        let then: Then

        beforeEach(() => {
          mockRequest.mockImplementationOnce(() => ({
            user: { currentUser: { role: UserRole.DEFENDER } },
            case: { type },
            body: { category },
          }))

          then = givenWhenThen()
        })

        it('should activate', () => {
          expect(then.result).toBe(true)
        })
      },
    )

    describe.each(
      Object.keys(CaseFileCategory).filter(
        (category) =>
          !allowedCaseFileCategories.includes(category as CaseFileCategory),
      ),
    )('a defender can not create %s', (category) => {
      let then: Then

      beforeEach(() => {
        mockRequest.mockImplementationOnce(() => ({
          user: { currentUser: { role: UserRole.DEFENDER } },
          case: { type },
          body: { category },
        }))

        then = givenWhenThen()
      })

      it('should not activate', () => {
        expect(then.result).toBe(false)
      })
    })
  })

  describe.each(
    Object.keys(UserRole).filter((role) => role !== UserRole.DEFENDER),
  )('role %s', (role) => {
    describe.each(Object.keys(CaseFileCategory))(
      'can not create %s',
      (category) => {
        let then: Then

        beforeEach(() => {
          mockRequest.mockImplementationOnce(() => ({
            user: { currentUser: { role } },
            case: {},
            body: { category },
          }))

          then = givenWhenThen()
        })

        it('should not activate', () => {
          expect(then.result).toBe(false)
        })
      },
    )
  })

  describe('missing user', () => {
    let then: Then

    beforeEach(() => {
      mockRequest.mockImplementationOnce(() => ({ case: {} }))

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
      mockRequest.mockImplementationOnce(() => ({ user: { currentUser: {} } }))

      then = givenWhenThen()
    })

    it('should throw InternalServerErrorException', () => {
      expect(then.error).toBeInstanceOf(InternalServerErrorException)
      expect(then.error.message).toBe('Missing case')
    })
  })

  describe('missing case file category', () => {
    let then: Then

    beforeEach(() => {
      mockRequest.mockImplementationOnce(() => ({
        user: { currentUser: { role: UserRole.DEFENDER } },
        case: { type: CaseType.INDICTMENT },
        body: {},
      }))

      then = givenWhenThen()
    })

    it('should throw BadRequestException', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error.message).toBe('Missing case file category')
    })
  })
})
