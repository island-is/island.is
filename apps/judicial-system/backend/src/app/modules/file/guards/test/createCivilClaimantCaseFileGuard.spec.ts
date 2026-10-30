import { ExecutionContext, ForbiddenException } from '@nestjs/common'

import {
  CaseFileCategory,
  InstitutionType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { CreateCivilClaimantCaseFileGuard } from '../createCivilClaimantCaseFile.guard'

interface Then {
  result: boolean
  error: Error
}

type GivenWhenThen = (user: User, category?: CaseFileCategory) => Then

describe('Create Civil Claimant Case File Guard', () => {
  const prosecutor = {
    role: UserRole.PROSECUTOR,
    institution: { type: InstitutionType.POLICE_PROSECUTORS_OFFICE },
  } as User
  const publicProsecutorStaff = {
    role: UserRole.PUBLIC_PROSECUTOR_STAFF,
    institution: { type: InstitutionType.PUBLIC_PROSECUTORS_OFFICE },
  } as User
  const courtOfAppealsRegistrar = {
    role: UserRole.COURT_OF_APPEALS_REGISTRAR,
    institution: { type: InstitutionType.COURT_OF_APPEALS },
  } as User

  let givenWhenThen: GivenWhenThen

  beforeEach(() => {
    givenWhenThen = (user, category): Then => {
      const guard = new CreateCivilClaimantCaseFileGuard()
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

  // The prosecution's file on a civil claimant; the court of appeals has no
  // part in it.
  describe(CaseFileCategory.CIVIL_CLAIM, () => {
    it.each([
      ['a prosecutor', prosecutor],
      ['the public prosecution office', publicProsecutorStaff],
    ])('can be created by %s', (_, user) => {
      const then = givenWhenThen(user, CaseFileCategory.CIVIL_CLAIM)

      expect(then.error).toBeUndefined()
      expect(then.result).toBe(true)
    })

    it('cannot be created by the court of appeals', () => {
      expectForbidden(
        givenWhenThen(courtOfAppealsRegistrar, CaseFileCategory.CIVIL_CLAIM),
        CaseFileCategory.CIVIL_CLAIM,
      )
    })
  })

  // The court files a claimant's verdict appeal statement on the claimant's
  // behalf; the prosecution has no part in it.
  describe.each([
    CaseFileCategory.DEFENDANT_VERDICT_APPEAL_STATEMENT,
    CaseFileCategory.DEFENDANT_VERDICT_APPEAL_STATEMENT_CASE_FILE,
  ])('%s', (category) => {
    it('can be created by the court of appeals', () => {
      const then = givenWhenThen(courtOfAppealsRegistrar, category)

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
    CaseFileCategory.DEFENDANT_APPEAL_STATEMENT,
    CaseFileCategory.PROSECUTOR_VERDICT_APPEAL_STATEMENT,
    CaseFileCategory.DEFENDANT_APPEAL_DECLARATION,
    CaseFileCategory.COURT_RECORD,
    undefined,
  ])('%s', (category) => {
    it.each([
      ['a prosecutor', prosecutor],
      ['the public prosecution office', publicProsecutorStaff],
      ['the court of appeals', courtOfAppealsRegistrar],
    ])('cannot be created by %s', (_, user) => {
      expectForbidden(givenWhenThen(user, category), category)
    })
  })
})
