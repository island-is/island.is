import {
  ExecutionContext,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common'

import {
  CaseFileCategory,
  CaseState,
  CaseType,
  completedCaseStates,
  extendedCourtRoles,
  indictmentCases,
  InstitutionType,
  investigationCases,
  prosecutionRoles,
  restrictionCases,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { LimitedAccessViewCaseFileGuard } from '../limitedAccessViewCaseFile.guard'

interface Then {
  result: boolean
  error: Error
}

type GivenWhenThen = () => Then

describe('Limited Access View Case File Guard', () => {
  const mockRequest = jest.fn()
  let givenWhenThen: GivenWhenThen

  beforeEach(() => {
    givenWhenThen = (): Then => {
      const guard = new LimitedAccessViewCaseFileGuard()
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

  describe('defence users', () => {
    describe.each([...restrictionCases, ...investigationCases])(
      'for %s cases',
      (type) => {
        describe.each(completedCaseStates)('in state %s', (state) => {
          const allowedCaseFileCategories = [
            CaseFileCategory.PROSECUTOR_APPEAL_BRIEF,
            CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT,
            CaseFileCategory.DEFENDANT_APPEAL_BRIEF,
            CaseFileCategory.DEFENDANT_APPEAL_BRIEF_CASE_FILE,
            CaseFileCategory.DEFENDANT_APPEAL_STATEMENT,
            CaseFileCategory.DEFENDANT_APPEAL_STATEMENT_CASE_FILE,
            CaseFileCategory.APPEAL_RULING,
          ]

          describe.each(allowedCaseFileCategories)(
            'a defender can view %s',
            (category) => {
              let then: Then

              beforeEach(() => {
                mockRequest.mockImplementationOnce(() => ({
                  user: { role: UserRole.DEFENDER },
                  case: { type, state },
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
                !allowedCaseFileCategories.includes(
                  category as CaseFileCategory,
                ),
            ),
          )('a defender can not view %s', (category) => {
            let then: Then

            beforeEach(() => {
              mockRequest.mockImplementationOnce(() => ({
                user: { role: UserRole.DEFENDER },
                case: { type, state },
                caseFile: { category },
              }))

              then = givenWhenThen()
            })

            it('should throw ForbiddenException', () => {
              expect(then.error).toBeInstanceOf(ForbiddenException)
              expect(then.error.message).toBe(
                `Forbidden for ${UserRole.DEFENDER}`,
              )
            })
          })
        })

        describe.each(
          Object.keys(CaseState).filter(
            (state) => !completedCaseStates.includes(state as CaseState),
          ),
        )('in state %s', (state) => {
          describe.each(Object.keys(CaseFileCategory))(
            'a defender can not view %s',
            (category) => {
              let then: Then

              beforeEach(() => {
                mockRequest.mockImplementationOnce(() => ({
                  user: { role: UserRole.DEFENDER },
                  case: { type, state },
                  caseFile: { category },
                }))

                then = givenWhenThen()
              })

              it('should throw ForbiddenException', () => {
                expect(then.error).toBeInstanceOf(ForbiddenException)
                expect(then.error.message).toBe(
                  `Forbidden for ${UserRole.DEFENDER}`,
                )
              })
            },
          )
        })
      },
    )

    describe.each(indictmentCases)('for %s cases', (type) => {
      describe.each(completedCaseStates)('in state %s', (state) => {
        const allowedCaseFileCategories = [
          CaseFileCategory.COURT_RECORD,
          CaseFileCategory.RULING,
          CaseFileCategory.COVER_LETTER,
          CaseFileCategory.INDICTMENT,
          CaseFileCategory.CRIMINAL_RECORD,
          CaseFileCategory.COST_BREAKDOWN,
          CaseFileCategory.CASE_FILE,
        ]

        describe.each(allowedCaseFileCategories)(
          'a defender can view %s',
          (category) => {
            let then: Then

            beforeEach(() => {
              mockRequest.mockImplementationOnce(() => ({
                user: { role: UserRole.DEFENDER },
                case: { type, state },
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
        )('a defender can not view %s', (category) => {
          let then: Then

          beforeEach(() => {
            mockRequest.mockImplementationOnce(() => ({
              user: { role: UserRole.DEFENDER },
              case: { type, state },
              caseFile: { category },
            }))

            then = givenWhenThen()
          })

          it('should throw ForbiddenException', () => {
            expect(then.error).toBeInstanceOf(ForbiddenException)
            expect(then.error.message).toBe(
              `Forbidden for ${UserRole.DEFENDER}`,
            )
          })
        })
      })

      describe.each(
        Object.keys(CaseState).filter(
          (state) => !completedCaseStates.includes(state as CaseState),
        ),
      )('in state %s', (state) => {
        describe.each(Object.keys(CaseFileCategory))(
          'a defender can not view %s',
          (category) => {
            let then: Then

            beforeEach(() => {
              mockRequest.mockImplementationOnce(() => ({
                user: { role: UserRole.DEFENDER },
                case: { type, state },
                caseFile: { category },
              }))

              then = givenWhenThen()
            })

            it('should throw ForbiddenException', () => {
              expect(then.error).toBeInstanceOf(ForbiddenException)
              expect(then.error.message).toBe(
                `Forbidden for ${UserRole.DEFENDER}`,
              )
            })
          },
        )
      })
    })
  })

  describe('prison system users', () => {
    const prisonUser = {
      role: UserRole.PRISON_SYSTEM_STAFF,
      institution: { type: InstitutionType.PRISON },
    }
    const prisonAdminUser = {
      role: UserRole.PRISON_SYSTEM_STAFF,
      institution: { type: InstitutionType.PRISON_ADMIN },
    }

    describe.each(Object.keys(CaseType))('for %s cases', (type) => {
      describe.each(completedCaseStates)('in state %s', (state) => {
        const allowedCaseFileCategories = [CaseFileCategory.APPEAL_RULING]

        describe.each(allowedCaseFileCategories)(
          'prison system users can view %s',
          (category) => {
            let thenPrison: Then
            let thenPrisonAdmin: Then

            beforeEach(() => {
              mockRequest.mockImplementationOnce(() => ({
                user: prisonUser,
                case: { type, state },
                caseFile: { category },
              }))
              mockRequest.mockImplementationOnce(() => ({
                user: prisonAdminUser,
                case: { type, state },
                caseFile: { category },
              }))

              thenPrison = givenWhenThen()
              thenPrisonAdmin = givenWhenThen()
            })

            it('should activate', () => {
              expect(thenPrison.result).toBe(true)
              expect(thenPrisonAdmin.result).toBe(true)
            })
          },
        )

        describe.each(
          Object.keys(CaseFileCategory).filter(
            (category) =>
              !allowedCaseFileCategories.includes(category as CaseFileCategory),
          ),
        )('prison system users can not view %s', (category) => {
          let thenPrison: Then
          let thenPrisonAdmin: Then

          beforeEach(() => {
            mockRequest.mockImplementationOnce(() => ({
              user: prisonUser,
              case: { type, state },
              caseFile: { category },
            }))
            mockRequest.mockImplementationOnce(() => ({
              user: prisonAdminUser,
              case: { type, state },
              caseFile: { category },
            }))

            thenPrison = givenWhenThen()
            thenPrisonAdmin = givenWhenThen()
          })

          it('should throw ForbiddenException', () => {
            expect(thenPrison.error).toBeInstanceOf(ForbiddenException)
            expect(thenPrison.error.message).toBe(
              `Forbidden for ${UserRole.PRISON_SYSTEM_STAFF}`,
            )
            expect(thenPrisonAdmin.error).toBeInstanceOf(ForbiddenException)
            expect(thenPrisonAdmin.error.message).toBe(
              `Forbidden for ${UserRole.PRISON_SYSTEM_STAFF}`,
            )
          })
        })
      })

      describe.each(
        Object.keys(CaseState).filter(
          (state) => !completedCaseStates.includes(state as CaseState),
        ),
      )('in state %s', (state) => {
        describe.each(Object.keys(CaseFileCategory))(
          'prison system users can not view %s',
          (category) => {
            let thenPrison: Then
            let thenPrisonAdmin: Then

            beforeEach(() => {
              mockRequest.mockImplementationOnce(() => ({
                user: prisonUser,
                case: { type, state },
                caseFile: { category },
              }))
              mockRequest.mockImplementationOnce(() => ({
                user: prisonAdminUser,
                case: { type, state },
                caseFile: { category },
              }))

              thenPrison = givenWhenThen()
              thenPrisonAdmin = givenWhenThen()
            })

            it('should throw ForbiddenException', () => {
              expect(thenPrison.error).toBeInstanceOf(ForbiddenException)
              expect(thenPrison.error.message).toBe(
                `Forbidden for ${UserRole.PRISON_SYSTEM_STAFF}`,
              )
              expect(thenPrisonAdmin.error).toBeInstanceOf(ForbiddenException)
              expect(thenPrisonAdmin.error.message).toBe(
                `Forbidden for ${UserRole.PRISON_SYSTEM_STAFF}`,
              )
            })
          },
        )
      })
    })
  })

  describe('remaining users', () => {
    describe.each(Object.keys(CaseType))('for %s cases', (type) => {
      describe.each(Object.keys(CaseState))('in state %s', (state) => {
        describe.each([
          ...prosecutionRoles.map((role) => [
            role,
            InstitutionType.PROSECUTORS_OFFICE,
          ]),
          ...extendedCourtRoles.map((role) => [
            role,
            InstitutionType.DISTRICT_COURT,
          ]),
          ...extendedCourtRoles.map((role) => [
            role,
            InstitutionType.COURT_OF_APPEALS,
          ]),
        ])('role %s %s', (role, institutionType) => {
          describe.each(Object.keys(CaseFileCategory))(
            'can not view %s',
            (category) => {
              let then: Then

              beforeEach(() => {
                mockRequest.mockImplementationOnce(() => ({
                  user: { role, institution: { type: institutionType } },
                  case: { type, state },
                  caseFile: { category },
                }))

                then = givenWhenThen()
              })

              it('should throw ForbiddenException', () => {
                expect(then.error).toBeInstanceOf(ForbiddenException)
                expect(then.error.message).toBe(`Forbidden for ${role}`)
              })
            },
          )
        })
      })
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
    const user = {} as User
    let then: Then

    beforeEach(() => {
      mockRequest.mockImplementationOnce(() => ({ user }))

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
      mockRequest.mockImplementationOnce(() => ({ user: {}, case: {} }))

      then = givenWhenThen()
    })

    it('should throw InternalServerErrorException', () => {
      expect(then.error).toBeInstanceOf(InternalServerErrorException)
      expect(then.error.message).toBe('Missing case file')
    })
  })
})
