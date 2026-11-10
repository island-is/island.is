import {
  BadRequestException,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common'

import { CaseFileCategory, UserRole } from '@island.is/judicial-system/types'

import { LimitedAccessCreateDefendantCaseFileGuard } from '../limitedAccessCreateDefendantCaseFile.guard'

interface Then {
  result: boolean
  error: Error
}

type GivenWhenThen = (request: {
  user?: { currentUser?: { role: UserRole; nationalId: string } }
  defendant?: {
    isDefenderChoiceConfirmed?: boolean
    defenderNationalId?: string
    isAppealDefenderConfirmed?: boolean
    isAppealDefenderWaived?: boolean
    appealDefenderNationalId?: string
  }
  body?: { category?: CaseFileCategory }
}) => Then

describe('LimitedAccess Create Defendant Case File Guard', () => {
  const nationalId = '1234567890'
  let givenWhenThen: GivenWhenThen

  beforeEach(() => {
    givenWhenThen = (request): Then => {
      const guard = new LimitedAccessCreateDefendantCaseFileGuard()
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
    CaseFileCategory.DEFENDANT_APPEAL_DECLARATION,
    CaseFileCategory.DEFENDANT_APPEAL_DECLARATION_CASE_FILE,
  ])('district-confirmed defender creating %s', (category) => {
    it('activates', () => {
      const then = givenWhenThen({
        user: { currentUser: { role: UserRole.DEFENDER, nationalId } },
        defendant: {
          isDefenderChoiceConfirmed: true,
          defenderNationalId: nationalId,
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
  ])('appeal-confirmed defender creating %s', (category) => {
    it('activates', () => {
      const then = givenWhenThen({
        user: { currentUser: { role: UserRole.DEFENDER, nationalId } },
        defendant: {
          isAppealDefenderConfirmed: true,
          appealDefenderNationalId: nationalId,
        },
        body: { category },
      })

      expect(then.error).toBeUndefined()
      expect(then.result).toBe(true)
    })

    it('does not activate for a district-only confirmed defender', () => {
      const then = givenWhenThen({
        user: { currentUser: { role: UserRole.DEFENDER, nationalId } },
        defendant: {
          isDefenderChoiceConfirmed: true,
          defenderNationalId: nationalId,
        },
        body: { category },
      })

      expect(then.error).toBeUndefined()
      expect(then.result).toBe(false)
    })

    it('does not activate when the appeal appointment is waived', () => {
      const then = givenWhenThen({
        user: { currentUser: { role: UserRole.DEFENDER, nationalId } },
        defendant: {
          isAppealDefenderConfirmed: true,
          isAppealDefenderWaived: true,
          appealDefenderNationalId: nationalId,
        },
        body: { category },
      })

      expect(then.error).toBeUndefined()
      expect(then.result).toBe(false)
    })
  })

  it('does not activate for a verdict statement when the national id does not match', () => {
    const then = givenWhenThen({
      user: { currentUser: { role: UserRole.DEFENDER, nationalId } },
      defendant: {
        isAppealDefenderConfirmed: true,
        appealDefenderNationalId: '0987654321',
      },
      body: { category: CaseFileCategory.DEFENDANT_VERDICT_APPEAL_STATEMENT },
    })

    expect(then.error).toBeUndefined()
    expect(then.result).toBe(false)
  })

  it('does not activate for a kæra category when only appeal-confirmed', () => {
    const then = givenWhenThen({
      user: { currentUser: { role: UserRole.DEFENDER, nationalId } },
      defendant: {
        isAppealDefenderConfirmed: true,
        appealDefenderNationalId: nationalId,
      },
      body: { category: CaseFileCategory.DEFENDANT_APPEAL_STATEMENT },
    })

    expect(then.error).toBeUndefined()
    expect(then.result).toBe(false)
  })

  it('rejects a missing category', () => {
    const then = givenWhenThen({
      user: { currentUser: { role: UserRole.DEFENDER, nationalId } },
      defendant: {
        isAppealDefenderConfirmed: true,
        appealDefenderNationalId: nationalId,
      },
      body: {},
    })

    expect(then.error).toBeInstanceOf(BadRequestException)
    expect(then.error.message).toBe('Missing case file category')
  })

  it('rejects a missing user', () => {
    const then = givenWhenThen({
      defendant: {
        isAppealDefenderConfirmed: true,
        appealDefenderNationalId: nationalId,
      },
      body: { category: CaseFileCategory.DEFENDANT_VERDICT_APPEAL_STATEMENT },
    })

    expect(then.error).toBeInstanceOf(InternalServerErrorException)
    expect(then.error.message).toBe('Missing user')
  })

  it('rejects a missing defendant', () => {
    const then = givenWhenThen({
      user: { currentUser: { role: UserRole.DEFENDER, nationalId } },
      body: { category: CaseFileCategory.DEFENDANT_VERDICT_APPEAL_STATEMENT },
    })

    expect(then.error).toBeInstanceOf(InternalServerErrorException)
    expect(then.error.message).toBe('Missing defendant')
  })
})
