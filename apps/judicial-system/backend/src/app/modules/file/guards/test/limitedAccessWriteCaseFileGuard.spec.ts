import {
  ExecutionContext,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common'

import { CaseFileCategory, UserRole } from '@island.is/judicial-system/types'

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
    'a defender can view %s',
    (category) => {
      describe('when creating a case file', () => {
        let then: Then

        beforeEach(() => {
          mockRequest.mockImplementationOnce(() => ({
            user: { role: UserRole.DEFENDER },
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
            user: { role: UserRole.DEFENDER },
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
  )('a defender can not view %s', (category) => {
    describe('when creating a case file', () => {
      let then: Then

      beforeEach(() => {
        mockRequest.mockImplementationOnce(() => ({
          user: { role: UserRole.DEFENDER },
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
          user: { role: UserRole.DEFENDER },
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
      'can not view %s',
      (category) => {
        describe('when creating a case file', () => {
          let then: Then

          beforeEach(() => {
            mockRequest.mockImplementationOnce(() => ({
              user: { role },
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
              user: { role },
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
      mockRequest.mockImplementationOnce(() => ({}))

      then = givenWhenThen()
    })

    it('should throw InternalServerErrorException', () => {
      expect(then.error).toBeInstanceOf(InternalServerErrorException)
      expect(then.error.message).toBe('Missing user')
    })
  })

  describe('missing case file category', () => {
    let then: Then

    beforeEach(() => {
      mockRequest.mockImplementationOnce(() => ({ user: {}, case: {} }))

      then = givenWhenThen()
    })

    it('should throw InternalServerErrorException', () => {
      expect(then.error).toBeInstanceOf(InternalServerErrorException)
      expect(then.error.message).toBe('Missing case file category')
    })
  })
})
