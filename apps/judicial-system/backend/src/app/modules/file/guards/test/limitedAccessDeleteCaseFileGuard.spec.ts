import { v4 as uuid } from 'uuid'

import { ExecutionContext, InternalServerErrorException } from '@nestjs/common'

import {
  CaseFileCategory,
  indictmentCases,
  investigationCases,
  restrictionCases,
  UserRole,
} from '@island.is/judicial-system/types'

import { LimitedAccessDeleteCaseFileGuard } from '../limitedAccessDeleteCaseFile.guard'

interface Then {
  result: boolean
  error: Error
}

type GivenWhenThen = () => Then

describe('LimitedAccess Delete Case File Guard', () => {
  const mockRequest = jest.fn()
  let givenWhenThen: GivenWhenThen

  beforeEach(() => {
    givenWhenThen = (): Then => {
      const guard = new LimitedAccessDeleteCaseFileGuard()
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
        CaseFileCategory.DEFENDANT_APPEAL_BRIEF_CASE_FILE,
        CaseFileCategory.DEFENDANT_APPEAL_STATEMENT_CASE_FILE,
        CaseFileCategory.DEFENDANT_APPEAL_CASE_FILE,
      ]

      describe.each(allowedCaseFileCategories)(
        'a defender can delete %s',
        (category) => {
          let then: Then

          beforeEach(() => {
            mockRequest.mockImplementationOnce(() => ({
              user: { currentUser: { role: UserRole.DEFENDER } },
              case: { type },
              caseFile: { category },
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
      )('a defender can not delete %s', (category) => {
        let then: Then

        beforeEach(() => {
          mockRequest.mockImplementationOnce(() => ({
            user: { currentUser: { role: UserRole.DEFENDER } },
            case: { type },
            caseFile: { category },
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
      CaseFileCategory.DEFENDANT_APPEAL_BRIEF_CASE_FILE,
      CaseFileCategory.DEFENDANT_APPEAL_STATEMENT_CASE_FILE,
      CaseFileCategory.DEFENDANT_APPEAL_CASE_FILE,
    ]

    describe.each(allowedCaseFileCategories)(
      'a confirmed defender can delete their defendant %s',
      (category) => {
        let then: Then

        beforeEach(() => {
          const nationalId = uuid()
          const defendantId = uuid()
          mockRequest.mockImplementationOnce(() => ({
            user: {
              currentUser: { role: UserRole.DEFENDER, nationalId },
            },
            case: {
              type,
              defendants: [
                {
                  id: defendantId,
                  isDefenderChoiceConfirmed: true,
                  defenderNationalId: nationalId,
                },
              ],
            },
            caseFile: { category, defendantId },
          }))

          then = givenWhenThen()
        })

        it('should activate', () => {
          expect(then.result).toBe(true)
        })
      },
    )

    describe.each(allowedCaseFileCategories)(
      'a confirmed spokesperson can delete their civil claimant %s',
      (category) => {
        let then: Then

        beforeEach(() => {
          const nationalId = uuid()
          const civilClaimantId = uuid()
          mockRequest.mockImplementationOnce(() => ({
            user: {
              currentUser: { role: UserRole.DEFENDER, nationalId },
            },
            case: {
              type,
              civilClaimants: [
                {
                  id: civilClaimantId,
                  isSpokespersonConfirmed: true,
                  spokespersonNationalId: nationalId,
                },
              ],
            },
            caseFile: { category, civilClaimantId },
          }))

          then = givenWhenThen()
        })

        it('should activate', () => {
          expect(then.result).toBe(true)
        })
      },
    )

    describe.each(allowedCaseFileCategories)(
      'a defender that does not control the case file can not delete %s',
      (category) => {
        let then: Then

        beforeEach(() => {
          const nationalId = uuid()
          const defendantId = uuid()
          mockRequest.mockImplementationOnce(() => ({
            user: {
              currentUser: { role: UserRole.DEFENDER, nationalId },
            },
            case: {
              type,
              defendants: [
                {
                  id: defendantId,
                  isDefenderChoiceConfirmed: true,
                  defenderNationalId: uuid(),
                },
              ],
            },
            caseFile: { category, defendantId },
          }))

          then = givenWhenThen()
        })

        it('should not activate', () => {
          expect(then.result).toBe(false)
        })
      },
    )

    describe.each(
      Object.keys(CaseFileCategory).filter(
        (category) =>
          !allowedCaseFileCategories.includes(category as CaseFileCategory),
      ),
    )(
      'a confirmed defender can not delete disallowed category %s',
      (category) => {
        let then: Then

        beforeEach(() => {
          const nationalId = uuid()
          const defendantId = uuid()
          mockRequest.mockImplementationOnce(() => ({
            user: {
              currentUser: { role: UserRole.DEFENDER, nationalId },
            },
            case: {
              type,
              defendants: [
                {
                  id: defendantId,
                  isDefenderChoiceConfirmed: true,
                  defenderNationalId: nationalId,
                },
              ],
            },
            caseFile: { category, defendantId },
          }))

          then = givenWhenThen()
        })

        it('should not activate', () => {
          expect(then.result).toBe(false)
        })
      },
    )
  })

  describe.each(
    Object.keys(UserRole).filter((role) => role !== UserRole.DEFENDER),
  )('role %s', (role) => {
    describe.each(Object.keys(CaseFileCategory))(
      'can not delete %s',
      (category) => {
        let then: Then

        beforeEach(() => {
          mockRequest.mockImplementationOnce(() => ({
            user: { currentUser: { role } },
            case: {},
            caseFile: { category },
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

  describe('missing case file', () => {
    let then: Then

    beforeEach(() => {
      mockRequest.mockImplementationOnce(() => ({
        user: { currentUser: {} },
        case: {},
      }))

      then = givenWhenThen()
    })

    it('should throw InternalServerErrorException', () => {
      expect(then.error).toBeInstanceOf(InternalServerErrorException)
      expect(then.error.message).toBe('Missing case file')
    })
  })

  describe('missing case file category', () => {
    let then: Then

    beforeEach(() => {
      mockRequest.mockImplementationOnce(() => ({
        user: { currentUser: { role: UserRole.DEFENDER } },
        case: {},
        caseFile: {},
      }))

      then = givenWhenThen()
    })

    it('should not activate', () => {
      expect(then.result).toBe(false)
    })
  })
})
