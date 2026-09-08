import { ExecutionContext, ForbiddenException } from '@nestjs/common'

import { CaseFileCategory } from '@island.is/judicial-system/types'

import { CreateDefendantCaseFileGuard } from '../createDefendantCaseFile.guard'

interface Then {
  result: boolean
  error: Error
}

type GivenWhenThen = (category?: CaseFileCategory) => Then

describe('Create Defendant Case File Guard', () => {
  let givenWhenThen: GivenWhenThen

  beforeEach(() => {
    givenWhenThen = (category): Then => {
      const guard = new CreateDefendantCaseFileGuard()
      const then = {} as Then

      try {
        then.result = guard.canActivate({
          switchToHttp: () => ({
            getRequest: () => ({ body: { category } }),
          }),
        } as unknown as ExecutionContext)
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe.each([
    CaseFileCategory.SENT_TO_PRISON_ADMIN_FILE,
    CaseFileCategory.CRIMINAL_RECORD,
    CaseFileCategory.DEFENDANT_APPEAL_DECLARATION,
    CaseFileCategory.DEFENDANT_APPEAL_DECLARATION_CASE_FILE,
  ])('a prosecution user can create %s', (category) => {
    it('should activate', () => {
      const then = givenWhenThen(category)

      expect(then.error).toBeUndefined()
      expect(then.result).toBe(true)
    })
  })

  describe.each([
    CaseFileCategory.DEFENDANT_APPEAL_BRIEF,
    CaseFileCategory.DEFENDANT_APPEAL_STATEMENT,
    CaseFileCategory.COURT_RECORD,
    CaseFileCategory.RULING,
    undefined,
  ])('a prosecution user cannot create %s', (category) => {
    it('should throw ForbiddenException', () => {
      const then = givenWhenThen(category)

      expect(then.error).toBeInstanceOf(ForbiddenException)
      expect(then.error.message).toBe(
        `Forbidden for case file category ${category}`,
      )
    })
  })
})
