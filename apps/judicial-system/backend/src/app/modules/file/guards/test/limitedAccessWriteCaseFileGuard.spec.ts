import {
  ExecutionContext,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common'

import {
  CaseFileCategory,
  CaseType,
  UserRole,
} from '@island.is/judicial-system/types'

import { LimitedAccessWriteCaseFileGuard } from '../limitedAccessWriteCaseFile.guard'

interface Then {
  result: boolean
  error: Error
}

type GivenWhenThen = () => Then

describe('LimitedAccess Write Case File Guard', () => {
  const allowedCaseFileCategories = [
    CaseFileCategory.DEFENDANT_APPEAL_BRIEF,
    CaseFileCategory.DEFENDANT_APPEAL_BRIEF_CASE_FILE,
    CaseFileCategory.DEFENDANT_APPEAL_STATEMENT,
    CaseFileCategory.DEFENDANT_APPEAL_STATEMENT_CASE_FILE,
    CaseFileCategory.DEFENDANT_APPEAL_CASE_FILE,
  ]
  const mockRequest = jest.fn()
  let givenWhenThen: GivenWhenThen

  beforeEach(() => {
    givenWhenThen = (): Then => {
      const guard = new LimitedAccessWriteCaseFileGuard()
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

  describe.each(allowedCaseFileCategories)(
    'a defender can write %s',
    (category) => {
      describe('when creating a case file', () => {
        let then: Then

        beforeEach(() => {
          mockRequest.mockImplementationOnce(() => ({
            user: { currentUser: { role: UserRole.DEFENDER } },
            case: {},
            body: { category },
          }))

          then = givenWhenThen()
        })

        it('should activate', () => {
          expect(then.result).toBe(true)
        })
      })

      describe('when deleting a case file', () => {
        let then: Then

        beforeEach(() => {
          mockRequest.mockImplementationOnce(() => ({
            user: { currentUser: { role: UserRole.DEFENDER } },
            case: {},
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
  )('a defender can not write %s', (category) => {
    describe('when creating a case file', () => {
      let then: Then

      beforeEach(() => {
        mockRequest.mockImplementationOnce(() => ({
          user: { currentUser: { role: UserRole.DEFENDER } },
          case: {},
          body: { category },
        }))

        then = givenWhenThen()
      })

      it('should throw ForbiddenException', () => {
        expect(then.error).toBeInstanceOf(ForbiddenException)
        expect(then.error.message).toBe(`Forbidden for ${UserRole.DEFENDER}`)
      })
    })

    describe('when deleting a case file', () => {
      let then: Then

      beforeEach(() => {
        mockRequest.mockImplementationOnce(() => ({
          user: { currentUser: { role: UserRole.DEFENDER } },
          case: {},
          caseFile: { category },
        }))

        then = givenWhenThen()
      })

      it('should throw ForbiddenException', () => {
        expect(then.error).toBeInstanceOf(ForbiddenException)
        expect(then.error.message).toBe(`Forbidden for ${UserRole.DEFENDER}`)
      })
    })
  })

  describe.each(
    Object.keys(UserRole).filter((role) => role !== UserRole.DEFENDER),
  )('role %s', (role) => {
    describe.each(Object.keys(CaseFileCategory))(
      'can not write %s',
      (category) => {
        describe('when creating a case file', () => {
          let then: Then

          beforeEach(() => {
            mockRequest.mockImplementationOnce(() => ({
              user: { currentUser: { role } },
              case: {},
              body: { category },
            }))

            then = givenWhenThen()
          })

          it('should throw ForbiddenException', () => {
            expect(then.error).toBeInstanceOf(ForbiddenException)
            expect(then.error.message).toBe(`Forbidden for ${role}`)
          })
        })

        describe('when deleting a case file', () => {
          let then: Then

          beforeEach(() => {
            mockRequest.mockImplementationOnce(() => ({
              user: { currentUser: { role } },
              case: {},
              caseFile: { category },
            }))

            then = givenWhenThen()
          })

          it('should throw ForbiddenException', () => {
            expect(then.error).toBeInstanceOf(ForbiddenException)
            expect(then.error.message).toBe(`Forbidden for ${role}`)
          })
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
        user: { currentUser: {} },
        case: {},
      }))

      then = givenWhenThen()
    })

    it('should throw InternalServerErrorException', () => {
      expect(then.error).toBeInstanceOf(InternalServerErrorException)
      expect(then.error.message).toBe('Missing case file category')
    })
  })

  describe('a defender can write DEFENDANT_CASE_FILE in indictment cases', () => {
    describe('when creating a case file', () => {
      let then: Then

      beforeEach(() => {
        mockRequest.mockImplementationOnce(() => ({
          user: { currentUser: { role: UserRole.DEFENDER } },
          case: { type: CaseType.INDICTMENT },
          body: { category: CaseFileCategory.DEFENDANT_CASE_FILE },
        }))

        then = givenWhenThen()
      })

      it('should activate', () => {
        expect(then.result).toBe(true)
      })
    })

    describe('when deleting a case file', () => {
      let then: Then

      beforeEach(() => {
        mockRequest.mockImplementationOnce(() => ({
          user: { currentUser: { role: UserRole.DEFENDER } },
          case: { type: CaseType.INDICTMENT },
          caseFile: { category: CaseFileCategory.DEFENDANT_CASE_FILE },
        }))

        then = givenWhenThen()
      })

      it('should activate', () => {
        expect(then.result).toBe(true)
      })
    })
  })

  describe.each(
    Object.keys(CaseType).filter((ct) => ct !== CaseType.INDICTMENT),
  )('a defender can not write DEFENDANT_CASE_FILE in %s cases', (caseType) => {
    describe('when creating a case file', () => {
      let then: Then

      beforeEach(() => {
        mockRequest.mockImplementationOnce(() => ({
          user: { currentUser: { role: UserRole.DEFENDER } },
          case: { type: caseType },
          body: { category: CaseFileCategory.DEFENDANT_CASE_FILE },
        }))

        then = givenWhenThen()
      })

      it('should throw ForbiddenException', () => {
        expect(then.error).toBeInstanceOf(ForbiddenException)
        expect(then.error.message).toBe(`Forbidden for DEFENDER`)
      })
    })

    describe('when deleting a case file', () => {
      let then: Then

      beforeEach(() => {
        mockRequest.mockImplementationOnce(() => ({
          user: { currentUser: { role: UserRole.DEFENDER } },
          case: { type: caseType },
          caseFile: { category: CaseFileCategory.DEFENDANT_CASE_FILE },
        }))

        then = givenWhenThen()
      })

      it('should throw ForbiddenException', () => {
        expect(then.error).toBeInstanceOf(ForbiddenException)
        expect(then.error.message).toBe(`Forbidden for DEFENDER`)
      })
    })
  })
})
