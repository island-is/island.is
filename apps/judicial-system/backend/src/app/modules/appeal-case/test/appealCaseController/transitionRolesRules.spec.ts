import {
  AppealDecisionPartyRole,
  AppealEventType,
  CaseAppealDecision,
  CaseType,
  InstitutionType,
  UserRole,
} from '@island.is/judicial-system/types'

import { AppealCase, AppealEventLog, Case, User } from '../../../repository'
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

// An APPEALED event on the appeal case - the appellant is now read from here.
const appealed = (fields: Partial<AppealEventLog> = {}): AppealEventLog =>
  ({ eventType: AppealEventType.APPEALED, ...fields } as AppealEventLog)

describe('AppealCaseController - transition withdrawal rules', () => {
  describe('prosecution', () => {
    const prosecutor = {
      role: UserRole.PROSECUTOR,
      nationalId: '0000000000',
      institution: { type: InstitutionType.POLICE_PROSECUTORS_OFFICE },
    }

    it.each([prosecutorTransitionRule, prosecutorRepresentativeTransitionRule])(
      'allows withdrawing a case-level appeal the prosecution made',
      (rule) => {
        const request = buildRequest(
          { type: CaseType.CUSTODY },
          { appealEventLogs: [appealed({ userRole: UserRole.PROSECUTOR })] },
          prosecutor,
        )

        expect(rule.canActivate?.(request)).toBe(true)
      },
    )

    it.each([prosecutorTransitionRule, prosecutorRepresentativeTransitionRule])(
      'denies withdrawing a case-level appeal the defence made',
      (rule) => {
        const request = buildRequest(
          { type: CaseType.CUSTODY },
          { appealEventLogs: [appealed({ userRole: UserRole.DEFENDER })] },
          prosecutor,
        )

        expect(rule.canActivate?.(request)).toBe(false)
      },
    )

    it.each([prosecutorTransitionRule, prosecutorRepresentativeTransitionRule])(
      'allows withdrawing a ruling-order appeal the prosecution made',
      (rule) => {
        const request = buildRequest(
          { type: CaseType.INDICTMENT },
          {
            rulingFileId: 'ruling-file-id',
            appealEventLogs: [appealed({ userRole: UserRole.PROSECUTOR })],
          },
          prosecutor,
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
            appealEventLogs: [
              appealed({
                userRole: UserRole.DEFENDER,
                defendantId: 'defendant-id',
              }),
            ],
          },
          prosecutor,
        )

        expect(rule.canActivate?.(request)).toBe(false)
      },
    )

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
    const defender = { role: UserRole.DEFENDER, nationalId }

    // A confirmed defendant/defender pairing for the given national id.
    const defendantOf = (defenderNationalId: string) => ({
      id: 'defendant-id',
      isDefenderChoiceConfirmed: true,
      defenderNationalId,
    })

    it('allows the current registered defender to withdraw a case-level request appeal', () => {
      const request = buildRequest(
        { type: CaseType.CUSTODY, defenderNationalId: nationalId },
        { appealEventLogs: [appealed({ userRole: UserRole.DEFENDER })] },
        defender,
      )

      expect(defenderTransitionRule.canActivate?.(request)).toBe(true)
    })

    it('denies a defender who is not the case defender on a request appeal', () => {
      const request = buildRequest(
        { type: CaseType.CUSTODY, defenderNationalId: '9999999999' },
        { appealEventLogs: [appealed({ userRole: UserRole.DEFENDER })] },
        defender,
      )

      expect(defenderTransitionRule.canActivate?.(request)).toBe(false)
    })

    it('allows the current defender of the party that appealed a case-level indictment', () => {
      const request = buildRequest(
        { type: CaseType.INDICTMENT, defendants: [defendantOf(nationalId)] },
        {
          appealEventLogs: [
            appealed({
              userRole: UserRole.DEFENDER,
              defendantId: 'defendant-id',
            }),
          ],
        },
        defender,
      )

      expect(defenderTransitionRule.canActivate?.(request)).toBe(true)
    })

    it('denies a defender who does not represent the party that appealed', () => {
      const request = buildRequest(
        { type: CaseType.INDICTMENT, defendants: [defendantOf('9999999999')] },
        {
          appealEventLogs: [
            appealed({
              userRole: UserRole.DEFENDER,
              defendantId: 'defendant-id',
            }),
          ],
        },
        defender,
      )

      expect(defenderTransitionRule.canActivate?.(request)).toBe(false)
    })

    it('allows the current defender of the party that appealed a ruling order', () => {
      const request = buildRequest(
        { type: CaseType.INDICTMENT, defendants: [defendantOf(nationalId)] },
        {
          rulingFileId: 'ruling-file-id',
          appealEventLogs: [
            appealed({
              userRole: UserRole.DEFENDER,
              defendantId: 'defendant-id',
            }),
          ],
        },
        defender,
      )

      expect(defenderTransitionRule.canActivate?.(request)).toBe(true)
    })

    it('denies the defender when only another party appealed the ruling order', () => {
      const request = buildRequest(
        { type: CaseType.INDICTMENT, defendants: [defendantOf(nationalId)] },
        {
          rulingFileId: 'ruling-file-id',
          appealEventLogs: [
            appealed({
              userRole: UserRole.DEFENDER,
              defendantId: 'other-defendant-id',
            }),
          ],
        },
        defender,
      )

      expect(defenderTransitionRule.canActivate?.(request)).toBe(false)
    })

    it('denies the defence from withdrawing a ruling-order appeal the prosecution made', () => {
      const request = buildRequest(
        { type: CaseType.INDICTMENT, defendants: [defendantOf(nationalId)] },
        {
          rulingFileId: 'ruling-file-id',
          appealEventLogs: [appealed({ userRole: UserRole.PROSECUTOR })],
        },
        defender,
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
        defender,
      )

      expect(defenderTransitionRule.canActivate?.(request)).toBe(true)
    })

    it('denies a defence party that already withdrew its in-court appeal', () => {
      const request = buildRequest(
        inCourtCase(true),
        { rulingFileId: 'ruling-file-id' },
        defender,
      )

      expect(defenderTransitionRule.canActivate?.(request)).toBe(false)
    })
  })
})
