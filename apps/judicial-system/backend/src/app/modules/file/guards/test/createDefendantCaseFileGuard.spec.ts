import { ExecutionContext, ForbiddenException } from '@nestjs/common'

import {
  CaseFileCategory,
  InstitutionType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { CreateDefendantCaseFileGuard } from '../createDefendantCaseFile.guard'

interface Then {
  result: boolean
  error: Error
}

type GivenWhenThen = (user: User, category?: CaseFileCategory) => Then

describe('Create Defendant Case File Guard', () => {
  const prosecutor = {
    role: UserRole.PROSECUTOR,
    institution: { type: InstitutionType.POLICE_PROSECUTORS_OFFICE },
  } as User
  const publicProsecutorStaff = {
    role: UserRole.PUBLIC_PROSECUTOR_STAFF,
    institution: { type: InstitutionType.PUBLIC_PROSECUTORS_OFFICE },
  } as User
  const courtOfAppealsAssistant = {
    role: UserRole.COURT_OF_APPEALS_ASSISTANT,
    institution: { type: InstitutionType.COURT_OF_APPEALS },
  } as User

  let givenWhenThen: GivenWhenThen

  beforeEach(() => {
    givenWhenThen = (user, category): Then => {
      const guard = new CreateDefendantCaseFileGuard()
      const then = {} as Then

      try {
        then.result = guard.canActivate({
          switchToHttp: () => ({
            getRequest: () => ({
              user: { currentUser: user },
              body: { category },
            }),
          }),
        } as unknown as ExecutionContext)
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  const expectForbidden = (then: Then, category?: CaseFileCategory) => {
    expect(then.error).toBeInstanceOf(ForbiddenException)
    expect(then.error.message).toBe(
      `Forbidden for case file category ${category}`,
    )
  }

  // The prosecution's files on a defendant; the court of appeals has no part
  // in them.
  describe.each([
    CaseFileCategory.SENT_TO_PRISON_ADMIN_FILE,
    CaseFileCategory.CRIMINAL_RECORD,
  ])('%s', (category) => {
    it.each([
      ['a prosecutor', prosecutor],
      ['the public prosecution office', publicProsecutorStaff],
    ])('can be created by %s', (_, user) => {
      const then = givenWhenThen(user, category)

      expect(then.error).toBeUndefined()
      expect(then.result).toBe(true)
    })

    it('cannot be created by the court of appeals', () => {
      expectForbidden(
        givenWhenThen(courtOfAppealsAssistant, category),
        category,
      )
    })
  })

  // The office files the declaration a defender sent it outside the system; a
  // prosecutor has no part in a defendant's appeal.
  describe.each([
    CaseFileCategory.DEFENDANT_APPEAL_DECLARATION,
    CaseFileCategory.DEFENDANT_APPEAL_DECLARATION_CASE_FILE,
  ])('%s', (category) => {
    it('can be created by the public prosecution office', () => {
      const then = givenWhenThen(publicProsecutorStaff, category)

      expect(then.error).toBeUndefined()
      expect(then.result).toBe(true)
    })

    it.each([
      ['a prosecutor', prosecutor],
      ['the court of appeals', courtOfAppealsAssistant],
    ])('cannot be created by %s', (_, user) => {
      expectForbidden(givenWhenThen(user, category), category)
    })
  })

  // The court files a defendant's verdict appeal statement on the
  // defendant's behalf; nobody else on this route does.
  describe.each([
    CaseFileCategory.DEFENDANT_VERDICT_APPEAL_STATEMENT,
    CaseFileCategory.DEFENDANT_VERDICT_APPEAL_STATEMENT_CASE_FILE,
  ])('%s', (category) => {
    it('can be created by the court of appeals', () => {
      const then = givenWhenThen(courtOfAppealsAssistant, category)

      expect(then.error).toBeUndefined()
      expect(then.result).toBe(true)
    })

    it.each([
      ['a prosecutor', prosecutor],
      ['the public prosecution office', publicProsecutorStaff],
    ])('cannot be created by %s', (_, user) => {
      expectForbidden(givenWhenThen(user, category), category)
    })
  })

  describe.each([
    CaseFileCategory.DEFENDANT_APPEAL_BRIEF,
    CaseFileCategory.DEFENDANT_APPEAL_STATEMENT,
    CaseFileCategory.PROSECUTOR_VERDICT_APPEAL_STATEMENT,
    CaseFileCategory.COURT_RECORD,
    CaseFileCategory.RULING,
    undefined,
  ])('%s', (category) => {
    it.each([
      ['a prosecutor', prosecutor],
      ['the public prosecution office', publicProsecutorStaff],
      ['the court of appeals', courtOfAppealsAssistant],
    ])('cannot be created by %s', (_, user) => {
      expectForbidden(givenWhenThen(user, category), category)
    })
  })
})
