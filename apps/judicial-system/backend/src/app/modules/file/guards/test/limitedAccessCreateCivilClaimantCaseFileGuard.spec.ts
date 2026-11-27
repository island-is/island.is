import {
  BadRequestException,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common'

import { CaseFileCategory, UserRole } from '@island.is/judicial-system/types'

import { LimitedAccessCreateCivilClaimantCaseFileGuard } from '../limitedAccessCreateCivilClaimantCaseFile.guard'

interface Then {
  result: boolean
  error: Error
}

type GivenWhenThen = (request: {
  user?: { currentUser?: { role: UserRole; nationalId: string } }
  civilClaimant?: {
    hasSpokesperson?: boolean
    isSpokespersonConfirmed?: boolean
    spokespersonNationalId?: string
    hasAppealSpokesperson?: boolean
    isAppealSpokespersonConfirmed?: boolean
    appealSpokespersonNationalId?: string
  }
  body?: { category?: CaseFileCategory }
}) => Then

describe('LimitedAccess Create Civil Claimant Case File Guard', () => {
  const nationalId = '1234567890'
  let givenWhenThen: GivenWhenThen

  beforeEach(() => {
    givenWhenThen = (request): Then => {
      const guard = new LimitedAccessCreateCivilClaimantCaseFileGuard()
      const then = {} as Then

      try {
        then.result = guard.canActivate({
          switchToHttp: () => ({
            getRequest: () => request,
          }),
        } as unknown as ExecutionContext)
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe.each([
    CaseFileCategory.DEFENDANT_APPEAL_BRIEF,
    CaseFileCategory.DEFENDANT_APPEAL_BRIEF_CASE_FILE,
    CaseFileCategory.DEFENDANT_APPEAL_STATEMENT,
    CaseFileCategory.DEFENDANT_APPEAL_STATEMENT_CASE_FILE,
    CaseFileCategory.DEFENDANT_APPEAL_CASE_FILE,
  ])('district-confirmed spokesperson creating %s', (category) => {
    it('activates', () => {
      const then = givenWhenThen({
        user: { currentUser: { role: UserRole.DEFENDER, nationalId } },
        civilClaimant: {
          hasSpokesperson: true,
          isSpokespersonConfirmed: true,
          spokespersonNationalId: nationalId,
        },
        body: { category },
      })

      expect(then.error).toBeUndefined()
      expect(then.result).toBe(true)
    })
  })

  describe.each([
    CaseFileCategory.DEFENDANT_VERDICT_APPEAL_STATEMENT,
    CaseFileCategory.DEFENDANT_VERDICT_APPEAL_STATEMENT_CASE_FILE,
  ])('appeal-confirmed spokesperson creating %s', (category) => {
    it('activates', () => {
      const then = givenWhenThen({
        user: { currentUser: { role: UserRole.DEFENDER, nationalId } },
        civilClaimant: {
          hasAppealSpokesperson: true,
          isAppealSpokespersonConfirmed: true,
          appealSpokespersonNationalId: nationalId,
        },
        body: { category },
      })

      expect(then.error).toBeUndefined()
      expect(then.result).toBe(true)
    })

    it('does not activate for a district-only confirmed spokesperson', () => {
      const then = givenWhenThen({
        user: { currentUser: { role: UserRole.DEFENDER, nationalId } },
        civilClaimant: {
          hasSpokesperson: true,
          isSpokespersonConfirmed: true,
          spokespersonNationalId: nationalId,
        },
        body: { category },
      })

      expect(then.error).toBeUndefined()
      expect(then.result).toBe(false)
    })

    it('does not activate when the appeal spokesperson has been removed', () => {
      const then = givenWhenThen({
        user: { currentUser: { role: UserRole.DEFENDER, nationalId } },
        civilClaimant: {
          hasAppealSpokesperson: false,
          isAppealSpokespersonConfirmed: true,
          appealSpokespersonNationalId: nationalId,
        },
        body: { category },
      })

      expect(then.error).toBeUndefined()
      expect(then.result).toBe(false)
    })
  })

  it('does not activate for a kæra category when only appeal-confirmed', () => {
    const then = givenWhenThen({
      user: { currentUser: { role: UserRole.DEFENDER, nationalId } },
      civilClaimant: {
        hasAppealSpokesperson: true,
        isAppealSpokespersonConfirmed: true,
        appealSpokespersonNationalId: nationalId,
      },
      body: { category: CaseFileCategory.DEFENDANT_APPEAL_STATEMENT },
    })

    expect(then.error).toBeUndefined()
    expect(then.result).toBe(false)
  })

  it('rejects a missing category', () => {
    const then = givenWhenThen({
      user: { currentUser: { role: UserRole.DEFENDER, nationalId } },
      civilClaimant: {
        hasAppealSpokesperson: true,
        isAppealSpokespersonConfirmed: true,
        appealSpokespersonNationalId: nationalId,
      },
      body: {},
    })

    expect(then.error).toBeInstanceOf(BadRequestException)
    expect(then.error.message).toBe('Missing case file category')
  })

  it('rejects a missing user', () => {
    const then = givenWhenThen({
      civilClaimant: {
        hasAppealSpokesperson: true,
        isAppealSpokespersonConfirmed: true,
        appealSpokespersonNationalId: nationalId,
      },
      body: { category: CaseFileCategory.DEFENDANT_VERDICT_APPEAL_STATEMENT },
    })

    expect(then.error).toBeInstanceOf(InternalServerErrorException)
    expect(then.error.message).toBe('Missing user')
  })

  it('rejects a missing civil claimant', () => {
    const then = givenWhenThen({
      user: { currentUser: { role: UserRole.DEFENDER, nationalId } },
      body: { category: CaseFileCategory.DEFENDANT_VERDICT_APPEAL_STATEMENT },
    })

    expect(then.error).toBeInstanceOf(InternalServerErrorException)
    expect(then.error.message).toBe('Missing civil claimant')
  })
})
