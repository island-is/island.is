import { uuid } from 'uuidv4'

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
  courtOfAppealsRoles,
  districtCourtRoles,
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
            CaseFileCategory.DEFENDANT_APPEAL_CASE_FILE,
            CaseFileCategory.APPEAL_RULING,
            CaseFileCategory.APPEAL_COURT_RECORD,
          ]

          describe.each(allowedCaseFileCategories)(
            'a defender can view %s',
            (category) => {
              let then: Then

              beforeEach(() => {
                mockRequest.mockImplementationOnce(() => ({
                  user: { currentUser: { role: UserRole.DEFENDER } },
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
                user: { currentUser: { role: UserRole.DEFENDER } },
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
                  user: { currentUser: { role: UserRole.DEFENDER } },
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
      describe.each(Object.values(CaseState))('in state %s', (state) => {
        const allowedCaseFileCategories = [
          CaseFileCategory.COURT_RECORD,
          CaseFileCategory.RULING,
          CaseFileCategory.CRIMINAL_RECORD,
          CaseFileCategory.COST_BREAKDOWN,
          CaseFileCategory.CASE_FILE,
          CaseFileCategory.PROSECUTOR_CASE_FILE,
          CaseFileCategory.INDEPENDENT_DEFENDANT_CASE_FILE,
          CaseFileCategory.CIVIL_CLAIMANT_LEGAL_SPOKESPERSON_CASE_FILE,
          CaseFileCategory.CIVIL_CLAIMANT_SPOKESPERSON_CASE_FILE,
          CaseFileCategory.DEFENDANT_CASE_FILE,
          CaseFileCategory.CIVIL_CLAIM,
          CaseFileCategory.COURT_INDICTMENT_RULING_ORDER,
        ]

        describe.each(allowedCaseFileCategories)(
          'case file category %s',
          (category) => {
            describe('a defender with case files access can view', () => {
              let then: Then

              beforeEach(() => {
                const nationalId = uuid()
                mockRequest.mockImplementationOnce(() => ({
                  user: {
                    currentUser: { role: UserRole.DEFENDER, nationalId },
                  },
                  case: {
                    type,
                    state,
                    defendants: [
                      {
                        defenderNationalId: nationalId,
                        isDefenderChoiceConfirmed: true,
                        caseFilesSharedWithDefender: true,
                      },
                    ],
                  },
                  caseFile: { category },
                }))

                then = givenWhenThen()
              })

              it('should activate', () => {
                expect(then.result).toBe(true)
              })
            })

            describe('spokesperson with case files access can view', () => {
              let then: Then

              beforeEach(() => {
                const nationalId = uuid()
                mockRequest.mockImplementationOnce(() => ({
                  user: {
                    currentUser: { role: UserRole.DEFENDER, nationalId },
                  },
                  case: {
                    type,
                    state,
                    civilClaimants: [
                      {
                        hasSpokesperson: true,
                        spokespersonNationalId: nationalId,
                        caseFilesSharedWithSpokesperson: true,
                        isSpokespersonConfirmed: true,
                      },
                    ],
                  },
                  caseFile: { category },
                }))

                then = givenWhenThen()
              })

              it('should activate', () => {
                expect(then.result).toBe(true)
              })
            })
          },
        )

        describe.each(
          Object.keys(CaseFileCategory).filter(
            (category) =>
              !allowedCaseFileCategories.includes(category as CaseFileCategory),
          ),
        )('case file category %s', (category) => {
          describe('a defender with case files access can not view', () => {
            let then: Then

            beforeEach(() => {
              const nationalId = uuid()
              mockRequest.mockImplementationOnce(() => ({
                user: { currentUser: { role: UserRole.DEFENDER, nationalId } },
                case: {
                  type,
                  state,
                  defendants: [{ defenderNationalId: nationalId }],
                },
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

          describe('spokesperson with case files access can not view', () => {
            let then: Then

            beforeEach(() => {
              const nationalId = uuid()
              mockRequest.mockImplementationOnce(() => ({
                user: { currentUser: { role: UserRole.DEFENDER, nationalId } },
                case: {
                  type,
                  state,
                  civilClaimants: [
                    {
                      hasSpokesperson: true,
                      spokespersonNationalId: nationalId,
                    },
                  ],
                },
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
      })
    })

    describe.each(indictmentCases)('for %s cases', (type) => {
      describe.each(Object.values(CaseState))('in state %s', (state) => {
        const allowedCaseFileCategories = [
          CaseFileCategory.COURT_RECORD,
          CaseFileCategory.RULING,
          CaseFileCategory.COURT_INDICTMENT_RULING_ORDER,
        ]

        describe.each(allowedCaseFileCategories)(
          'case file category %s',
          (category) => {
            describe('a defender without case files access can view', () => {
              let then: Then

              beforeEach(() => {
                const nationalId = uuid()
                mockRequest.mockImplementationOnce(() => ({
                  user: {
                    currentUser: { role: UserRole.DEFENDER, nationalId },
                  },
                  case: {
                    type,
                    state,
                  },
                  caseFile: { category },
                }))

                then = givenWhenThen()
              })

              it('should activate', () => {
                expect(then.result).toBe(true)
              })
            })

            describe('spokesperson without case files access can view', () => {
              let then: Then

              beforeEach(() => {
                const nationalId = uuid()
                mockRequest.mockImplementationOnce(() => ({
                  user: {
                    currentUser: { role: UserRole.DEFENDER, nationalId },
                  },
                  case: {
                    type,
                    state,
                    civilClaimants: [
                      {
                        hasSpokesperson: true,
                        spokespersonNationalId: nationalId,
                      },
                    ],
                  },
                  caseFile: { category },
                }))

                then = givenWhenThen()
              })

              it('should activate', () => {
                expect(then.result).toBe(true)
              })
            })
          },
        )

        describe.each(
          Object.keys(CaseFileCategory).filter(
            (category) =>
              !allowedCaseFileCategories.includes(category as CaseFileCategory),
          ),
        )('case file category %s', (category) => {
          describe('a defender without case files access can not view', () => {
            let then: Then

            beforeEach(() => {
              const nationalId = uuid()
              mockRequest.mockImplementationOnce(() => ({
                user: { currentUser: { role: UserRole.DEFENDER, nationalId } },
                case: {
                  type,
                  state,
                },
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

          describe('spokesperson without case files access can not view', () => {
            let then: Then

            beforeEach(() => {
              const nationalId = uuid()
              mockRequest.mockImplementationOnce(() => ({
                user: { currentUser: { role: UserRole.DEFENDER, nationalId } },
                case: {
                  type,
                  state,
                  civilClaimants: [
                    {
                      hasSpokesperson: true,
                      spokespersonNationalId: nationalId,
                    },
                  ],
                },
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
      })
    })
  })

  describe('prison admin users', () => {
    const prisonAdminUser = {
      role: UserRole.PRISON_SYSTEM_STAFF,
      institution: { type: InstitutionType.PRISON_ADMIN },
    }

    describe.each(Object.keys(CaseType))('for %s cases', (type) => {
      describe.each(completedCaseStates)('in state %s', (state) => {
        const allowedCaseFileCategories = [
          CaseFileCategory.APPEAL_RULING,
          CaseFileCategory.RULING,
          CaseFileCategory.SENT_TO_PRISON_ADMIN_FILE,
          CaseFileCategory.COURT_RECORD,
          CaseFileCategory.CRIMINAL_RECORD_UPDATE,
        ]

        describe.each(allowedCaseFileCategories)(
          'prison admin users can view %s',
          (category) => {
            let thenPrisonAdmin: Then

            beforeEach(() => {
              mockRequest.mockImplementationOnce(() => ({
                user: { currentUser: prisonAdminUser },
                case: { type, state },
                caseFile: { category },
              }))

              thenPrisonAdmin = givenWhenThen()
            })

            it('should activate', () => {
              expect(thenPrisonAdmin.result).toBe(true)
            })
          },
        )

        describe.each(
          Object.keys(CaseFileCategory).filter(
            (category) =>
              !allowedCaseFileCategories.includes(category as CaseFileCategory),
          ),
        )('prison admin users can not view %s', (category) => {
          let thenPrisonAdmin: Then

          beforeEach(() => {
            mockRequest.mockImplementationOnce(() => ({
              user: { currentUser: prisonAdminUser },
              case: { type, state },
              caseFile: { category },
            }))

            thenPrisonAdmin = givenWhenThen()
          })

          it('should throw ForbiddenException', () => {
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
          'prison admin users can not view %s',
          (category) => {
            let thenPrisonAdmin: Then

            beforeEach(() => {
              mockRequest.mockImplementationOnce(() => ({
                user: { currentUser: prisonAdminUser },
                case: { type, state },
                caseFile: { category },
              }))

              thenPrisonAdmin = givenWhenThen()
            })

            it('should throw ForbiddenException', () => {
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

  describe('prison users', () => {
    const prisonUser = {
      role: UserRole.PRISON_SYSTEM_STAFF,
      institution: { type: InstitutionType.PRISON },
    }

    describe.each(Object.keys(CaseType))('for %s cases', (type) => {
      describe.each(completedCaseStates)('in state %s', (state) => {
        const allowedCaseFileCategories = [CaseFileCategory.APPEAL_RULING]

        describe.each(allowedCaseFileCategories)(
          'prison users can view %s',
          (category) => {
            let then: Then

            beforeEach(() => {
              mockRequest.mockImplementationOnce(() => ({
                user: { currentUser: prisonUser },
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
        )('prison users can not view %s', (category) => {
          let then: Then

          beforeEach(() => {
            mockRequest.mockImplementationOnce(() => ({
              user: { currentUser: prisonUser },
              case: { type, state },
              caseFile: { category },
            }))

            then = givenWhenThen()
          })

          it('should throw ForbiddenException', () => {
            expect(then.error).toBeInstanceOf(ForbiddenException)
            expect(then.error.message).toBe(
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
          'prison users can not view %s',
          (category) => {
            let thenPrison: Then

            beforeEach(() => {
              mockRequest.mockImplementationOnce(() => ({
                user: { currentUser: prisonUser },
                case: { type, state },
                caseFile: { category },
              }))

              thenPrison = givenWhenThen()
            })

            it('should throw ForbiddenException', () => {
              expect(thenPrison.error).toBeInstanceOf(ForbiddenException)
              expect(thenPrison.error.message).toBe(
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
            InstitutionType.POLICE_PROSECUTORS_OFFICE,
          ]),
          ...districtCourtRoles.map((role) => [
            role,
            InstitutionType.DISTRICT_COURT,
          ]),
          ...courtOfAppealsRoles.map((role) => [
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
                  user: {
                    currentUser: {
                      role,
                      institution: { type: institutionType },
                    },
                  },
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
      mockRequest.mockImplementationOnce(() => ({
        user: { currentUser: user },
      }))

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
})
