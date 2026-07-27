import {
  AppealDecisionPartyRole,
  CaseAppealDecision,
  CaseType,
  InstitutionType,
  UserRole,
} from '@island.is/judicial-system/types'

import { AppealCase, Case, User } from '../../../repository'
import {
  defenderTransitionRule,
  prosecutorRepresentativeTransitionRule,
  prosecutorTransitionRule,
} from '../../guards/rolesRules'

// Builds a minimal request as seen by RolesGuard after CaseExistsGuard and
// AppealCaseExistsGuard have populated request.case and request.appealCase.
const buildRequest = (
  theCase: Partial<Case>,
  appealCase: Partial<AppealCase>,
  user?: Partial<User>,
) => ({
  case: theCase as Case,
  appealCase: appealCase as AppealCase,
  user: user ? { currentUser: user as User } : undefined,
})

describe('AppealCaseController - transition withdrawal rules', () => {
  describe('prosecution', () => {
    it.each([prosecutorTransitionRule, prosecutorRepresentativeTransitionRule])(
      'allows withdrawing a case-level appeal the prosecution made',
      (rule) => {
        const request = buildRequest(
          { type: CaseType.CUSTODY, prosecutorPostponedAppealDate: new Date() },
          {},
        )

        expect(rule.canActivate?.(request)).toBe(true)
      },
    )

    it.each([prosecutorTransitionRule, prosecutorRepresentativeTransitionRule])(
      'denies withdrawing a case-level appeal the prosecution did not make',
      (rule) => {
        const request = buildRequest({ type: CaseType.CUSTODY }, {})

        expect(rule.canActivate?.(request)).toBe(false)
      },
    )

    it.each([prosecutorTransitionRule, prosecutorRepresentativeTransitionRule])(
      'allows withdrawing a ruling-order appeal the prosecution made',
      (rule) => {
        const request = buildRequest(
          { type: CaseType.INDICTMENT },
          { rulingFileId: 'ruling-file-id' },
        )

        expect(rule.canActivate?.(request)).toBe(true)
      },
    )

    it.each([prosecutorTransitionRule, prosecutorRepresentativeTransitionRule])(
      'denies withdrawing a ruling-order appeal the defence made',
      (rule) => {
        const request = buildRequest(
          { type: CaseType.INDICTMENT },
          {
            rulingFileId: 'ruling-file-id',
            appealedByNationalId: '0000000000',
          },
        )

        expect(rule.canActivate?.(request)).toBe(false)
      },
    )

    const prosecutor = {
      role: UserRole.PROSECUTOR,
      nationalId: '0000000000',
      institution: { type: InstitutionType.POLICE_PROSECUTORS_OFFICE },
    }

    it.each([prosecutorTransitionRule, prosecutorRepresentativeTransitionRule])(
      'allows withdrawing an in-court ruling-order appeal the prosecution made',
      (rule) => {
        const request = buildRequest(
          {
            type: CaseType.INDICTMENT,
            appealDecisions: [
              {
                rulingFileId: 'ruling-file-id',
                partyRole: AppealDecisionPartyRole.PROSECUTOR,
                decision: CaseAppealDecision.APPEAL,
              },
            ],
          } as Partial<Case>,
          { rulingFileId: 'ruling-file-id' },
          prosecutor,
        )

        expect(rule.canActivate?.(request)).toBe(true)
      },
    )

    it.each([prosecutorTransitionRule, prosecutorRepresentativeTransitionRule])(
      'denies withdrawing an in-court ruling-order appeal already withdrawn',
      (rule) => {
        const request = buildRequest(
          {
            type: CaseType.INDICTMENT,
            appealDecisions: [
              {
                rulingFileId: 'ruling-file-id',
                partyRole: AppealDecisionPartyRole.PROSECUTOR,
                decision: CaseAppealDecision.APPEAL,
                withdrawnDate: new Date(),
              },
            ],
          } as Partial<Case>,
          { rulingFileId: 'ruling-file-id' },
          prosecutor,
        )

        expect(rule.canActivate?.(request)).toBe(false)
      },
    )
  })

  describe('defence', () => {
    const nationalId = '0101010101'

    it('allows withdrawing a case-level request-case appeal the defence made', () => {
      const request = buildRequest(
        { type: CaseType.CUSTODY, accusedPostponedAppealDate: new Date() },
        {},
        { nationalId },
      )

      expect(defenderTransitionRule.canActivate?.(request)).toBe(true)
    })

    it('allows the specific defender who appealed a case-level indictment to withdraw', () => {
      const request = buildRequest(
        { type: CaseType.INDICTMENT, accusedPostponedAppealDate: new Date() },
        { appealedByNationalId: nationalId },
        { nationalId },
      )

      expect(defenderTransitionRule.canActivate?.(request)).toBe(true)
    })

    it('denies another defender from withdrawing a case-level indictment appeal', () => {
      const request = buildRequest(
        { type: CaseType.INDICTMENT, accusedPostponedAppealDate: new Date() },
        { appealedByNationalId: '9999999999' },
        { nationalId },
      )

      expect(defenderTransitionRule.canActivate?.(request)).toBe(false)
    })

    it('allows the specific defender who appealed a ruling order to withdraw', () => {
      const request = buildRequest(
        { type: CaseType.INDICTMENT },
        { rulingFileId: 'ruling-file-id', appealedByNationalId: nationalId },
        { nationalId },
      )

      expect(defenderTransitionRule.canActivate?.(request)).toBe(true)
    })

    it('denies a different defender from withdrawing a ruling-order appeal', () => {
      const request = buildRequest(
        { type: CaseType.INDICTMENT },
        { rulingFileId: 'ruling-file-id', appealedByNationalId: '9999999999' },
        { nationalId },
      )

      expect(defenderTransitionRule.canActivate?.(request)).toBe(false)
    })

    it('denies withdrawing a ruling-order appeal the prosecution made', () => {
      const request = buildRequest(
        { type: CaseType.INDICTMENT },
        { rulingFileId: 'ruling-file-id' },
        { nationalId },
      )

      expect(defenderTransitionRule.canActivate?.(request)).toBe(false)
    })

    const inCourtCase = (withdrawn: boolean): Partial<Case> => ({
      type: CaseType.INDICTMENT,
      defendants: [
        {
          id: 'defendant-id',
          isDefenderChoiceConfirmed: true,
          defenderNationalId: nationalId,
        },
      ],
      appealDecisions: [
        {
          rulingFileId: 'ruling-file-id',
          partyRole: AppealDecisionPartyRole.DEFENDANT,
          defendantId: 'defendant-id',
          decision: CaseAppealDecision.APPEAL,
          ...(withdrawn ? { withdrawnDate: new Date() } : {}),
        },
      ],
    })

    it('allows the defence party that appealed in court to withdraw', () => {
      const request = buildRequest(
        inCourtCase(false),
        { rulingFileId: 'ruling-file-id' },
        { role: UserRole.DEFENDER, nationalId },
      )

      expect(defenderTransitionRule.canActivate?.(request)).toBe(true)
    })

    it('denies a defence party that already withdrew its in-court appeal', () => {
      const request = buildRequest(
        inCourtCase(true),
        { rulingFileId: 'ruling-file-id' },
        { role: UserRole.DEFENDER, nationalId },
      )

      expect(defenderTransitionRule.canActivate?.(request)).toBe(false)
    })
  })
})
