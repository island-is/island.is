import { CaseType, UserRole } from '@island.is/judicial-system/types'

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
  })
})
