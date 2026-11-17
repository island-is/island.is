import { RulesType } from '@island.is/judicial-system/auth'
import { type User, UserRole } from '@island.is/judicial-system/types'

import { Case, CivilClaimant, Defendant } from '../../../repository'
import { defenderGeneratedPdfRule } from '../rolesRules'

describe('defenderGeneratedPdfRule', () => {
  if (typeof defenderGeneratedPdfRule === 'string') {
    throw new Error('Expected a rule object')
  }

  const rule = defenderGeneratedPdfRule
  const nationalId = '1234567890'

  const canActivate = (request: unknown) =>
    rule.canActivate?.(
      request as Parameters<NonNullable<typeof rule.canActivate>>[0],
    )

  const requestFor = ({
    user,
    theCase,
  }: {
    user?: Partial<User>
    theCase?: Partial<Case>
  }) => ({
    user: user === undefined ? undefined : { currentUser: user as User },
    case: theCase as Case | undefined,
  })

  it('should gate the defender role with a basic rule', () => {
    expect(rule.role).toBe(UserRole.DEFENDER)
    expect(rule.type).toBe(RulesType.BASIC)
  })

  it('should deny when the user or case is missing', () => {
    expect(canActivate(requestFor({}))).toBe(false)
    expect(
      canActivate(requestFor({ user: { nationalId }, theCase: undefined })),
    ).toBe(false)
    expect(
      canActivate(requestFor({ user: undefined, theCase: { defendants: [] } })),
    ).toBe(false)
  })

  it('should allow a district defender with case file access', () => {
    expect(
      canActivate(
        requestFor({
          user: { nationalId },
          theCase: {
            defendants: [
              {
                defenderNationalId: nationalId,
                isDefenderChoiceConfirmed: true,
                caseFilesSharedWithDefender: true,
              } as Defendant,
            ],
          },
        }),
      ),
    ).toBe(true)
  })

  it('should allow a confirmed appeal defender', () => {
    expect(
      canActivate(
        requestFor({
          user: { nationalId },
          theCase: {
            defendants: [
              {
                appealDefenderNationalId: nationalId,
                isAppealDefenderConfirmed: true,
                isAppealDefenderWaived: false,
              } as Defendant,
            ],
          },
        }),
      ),
    ).toBe(true)
  })

  it('should deny a waived appeal defender', () => {
    expect(
      canActivate(
        requestFor({
          user: { nationalId },
          theCase: {
            defendants: [
              {
                appealDefenderNationalId: nationalId,
                isAppealDefenderConfirmed: true,
                isAppealDefenderWaived: true,
              } as Defendant,
            ],
          },
        }),
      ),
    ).toBe(false)
  })

  it('should allow a confirmed appeal spokesperson', () => {
    expect(
      canActivate(
        requestFor({
          user: { nationalId },
          theCase: {
            civilClaimants: [
              {
                appealSpokespersonNationalId: nationalId,
                isAppealSpokespersonConfirmed: true,
                hasAppealSpokesperson: true,
              } as CivilClaimant,
            ],
          },
        }),
      ),
    ).toBe(true)
  })

  it('should deny a defender without district file access or appeal confirmation', () => {
    expect(
      canActivate(
        requestFor({
          user: { nationalId },
          theCase: {
            defendants: [
              {
                defenderNationalId: nationalId,
                isDefenderChoiceConfirmed: true,
                caseFilesSharedWithDefender: false,
              } as Defendant,
            ],
          },
        }),
      ),
    ).toBe(false)
  })
})
