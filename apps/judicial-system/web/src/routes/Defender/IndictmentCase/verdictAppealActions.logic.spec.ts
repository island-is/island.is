import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import type {
  Defendant,
  User,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  CaseIndictmentRulingDecision,
  CaseState,
  ServiceRequirement,
  UserRole,
  VerdictAppealDecision,
} from '@island.is/judicial-system-web/src/graphql/schema'

import {
  canDefenderAcceptVerdictOf,
  canDefenderAppealVerdictOf,
  canDefenderWithdrawVerdictAppealOf,
  getVerdictAppealActions,
  isConfirmedDefenderOf,
} from './verdictAppealActions.logic'

describe('verdictAppealActions', () => {
  const defenderNationalId = '1111111111'
  const user = {
    id: 'user_id',
    role: UserRole.DEFENDER,
    nationalId: defenderNationalId,
  } as User

  const defendant = (overrides: Partial<Defendant> = {}): Defendant =>
    ({
      id: 'defendant_id',
      isDefenderChoiceConfirmed: true,
      defenderNationalId,
      isVerdictAppealDeadlineExpired: false,
      verdict: {
        id: 'verdict_id',
        serviceRequirement: ServiceRequirement.REQUIRED,
        serviceDate: '2026-06-01T13:31:00.000Z',
      },
      ...overrides,
    } as Defendant)

  const theCase = (overrides: Partial<WorkingCase> = {}): WorkingCase =>
    ({
      id: 'case_id',
      state: CaseState.COMPLETED,
      indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
      ...overrides,
    } as WorkingCase)

  describe('isConfirmedDefenderOf', () => {
    it('should accept the confirmed defender', () => {
      expect(isConfirmedDefenderOf(user, defendant())).toBe(true)
    })

    it('should accept a formatted national id', () => {
      expect(
        isConfirmedDefenderOf(
          { ...user, nationalId: '111111-1111' },
          defendant(),
        ),
      ).toBe(true)
    })

    it('should reject a defender that has not been confirmed', () => {
      expect(
        isConfirmedDefenderOf(
          user,
          defendant({ isDefenderChoiceConfirmed: false }),
        ),
      ).toBe(false)
    })

    it('should reject another defender', () => {
      expect(
        isConfirmedDefenderOf(
          user,
          defendant({ defenderNationalId: '2222222222' }),
        ),
      ).toBe(false)
    })

    it('should reject a missing user', () => {
      expect(isConfirmedDefenderOf(undefined, defendant())).toBe(false)
    })
  })

  describe('canDefenderAppealVerdictOf', () => {
    it('should allow the confirmed defender of a served verdict within the deadline', () => {
      expect(canDefenderAppealVerdictOf(theCase(), defendant(), user)).toBe(
        true,
      )
    })

    it('should allow when the defendant was present and no service was needed', () => {
      expect(
        canDefenderAppealVerdictOf(
          theCase(),
          defendant({
            verdict: {
              id: 'verdict_id',
              serviceRequirement: ServiceRequirement.NOT_APPLICABLE,
            },
          }),
          user,
        ),
      ).toBe(true)
    })

    it('should refuse another defendant of the case', () => {
      expect(
        canDefenderAppealVerdictOf(
          theCase(),
          defendant({ defenderNationalId: '2222222222' }),
          user,
        ),
      ).toBe(false)
    })

    it('should refuse while the case is open', () => {
      expect(
        canDefenderAppealVerdictOf(
          theCase({ state: CaseState.RECEIVED }),
          defendant(),
          user,
        ),
      ).toBe(false)
    })

    it('should refuse a case that did not end in a verdict', () => {
      expect(
        canDefenderAppealVerdictOf(
          theCase({
            indictmentRulingDecision: CaseIndictmentRulingDecision.FINE,
          }),
          defendant(),
          user,
        ),
      ).toBe(false)
    })

    it('should refuse a verdict that has not been served', () => {
      expect(
        canDefenderAppealVerdictOf(
          theCase(),
          defendant({
            verdict: {
              id: 'verdict_id',
              serviceRequirement: ServiceRequirement.REQUIRED,
            },
          }),
          user,
        ),
      ).toBe(false)
    })

    it('should refuse a default judgement', () => {
      expect(
        canDefenderAppealVerdictOf(
          theCase(),
          defendant({
            verdict: {
              id: 'verdict_id',
              serviceRequirement: ServiceRequirement.REQUIRED,
              serviceDate: '2026-06-01T13:31:00.000Z',
              isDefaultJudgement: true,
            },
          }),
          user,
        ),
      ).toBe(false)
    })

    it('should refuse once the appeal deadline has expired', () => {
      expect(
        canDefenderAppealVerdictOf(
          theCase(),
          defendant({ isVerdictAppealDeadlineExpired: true }),
          user,
        ),
      ).toBe(false)
    })

    it('should refuse a verdict that has already been appealed', () => {
      expect(
        canDefenderAppealVerdictOf(
          theCase(),
          defendant({
            verdict: {
              id: 'verdict_id',
              serviceRequirement: ServiceRequirement.REQUIRED,
              serviceDate: '2026-06-01T13:31:00.000Z',
              appealDate: '2026-06-04T13:34:00.000Z',
            },
          }),
          user,
        ),
      ).toBe(false)
    })
  })

  describe('canDefenderWithdrawVerdictAppealOf', () => {
    const appealed = defendant({
      verdict: {
        id: 'verdict_id',
        serviceRequirement: ServiceRequirement.REQUIRED,
        serviceDate: '2026-06-01T13:31:00.000Z',
        appealDate: '2026-06-04T13:34:00.000Z',
      },
    })
    const appealedCase = theCase({
      verdictAppealCase: { id: 'appeal_case_id' },
    })

    it('should allow the confirmed defender of an appealed verdict', () => {
      expect(
        canDefenderWithdrawVerdictAppealOf(appealedCase, appealed, user),
      ).toBe(true)
    })

    it('should refuse when the verdict has not been appealed', () => {
      expect(
        canDefenderWithdrawVerdictAppealOf(appealedCase, defendant(), user),
      ).toBe(false)
    })

    it('should refuse without an appeal case to withdraw from', () => {
      expect(
        canDefenderWithdrawVerdictAppealOf(theCase(), appealed, user),
      ).toBe(false)
    })

    it('should refuse another defendant of the case', () => {
      expect(
        canDefenderWithdrawVerdictAppealOf(
          appealedCase,
          { ...appealed, defenderNationalId: '2222222222' },
          user,
        ),
      ).toBe(false)
    })
  })

  describe('canDefenderAcceptVerdictOf', () => {
    const verdict = {
      id: 'verdict_id',
      serviceRequirement: ServiceRequirement.REQUIRED,
      serviceDate: '2026-06-01T13:31:00.000Z',
    }

    it('should allow the confirmed defender of a served verdict', () => {
      expect(canDefenderAcceptVerdictOf(theCase(), defendant(), user)).toBe(
        true,
      )
    })

    it('should allow while the defendant has taken the appeal period', () => {
      expect(
        canDefenderAcceptVerdictOf(
          theCase(),
          defendant({
            verdict: {
              ...verdict,
              appealDecision: VerdictAppealDecision.POSTPONE,
            },
          }),
          user,
        ),
      ).toBe(true)
    })

    // Unlike an appeal, the position can be registered after the deadline.
    it('should allow after the appeal deadline has passed', () => {
      expect(
        canDefenderAcceptVerdictOf(
          theCase(),
          defendant({ isVerdictAppealDeadlineExpired: true }),
          user,
        ),
      ).toBe(true)
    })

    it('should refuse a verdict that is already accepted', () => {
      expect(
        canDefenderAcceptVerdictOf(
          theCase(),
          defendant({
            verdict: {
              ...verdict,
              appealDecision: VerdictAppealDecision.ACCEPT,
            },
          }),
          user,
        ),
      ).toBe(false)
    })

    it('should refuse an appealed verdict', () => {
      expect(
        canDefenderAcceptVerdictOf(
          theCase(),
          defendant({
            verdict: { ...verdict, appealDate: '2026-06-04T13:34:00.000Z' },
          }),
          user,
        ),
      ).toBe(false)
    })

    it('should refuse a verdict that has not been served', () => {
      expect(
        canDefenderAcceptVerdictOf(
          theCase(),
          defendant({
            verdict: {
              id: 'verdict_id',
              serviceRequirement: ServiceRequirement.REQUIRED,
            },
          }),
          user,
        ),
      ).toBe(false)
    })

    it('should refuse another defendant of the case', () => {
      expect(
        canDefenderAcceptVerdictOf(
          theCase(),
          defendant({ defenderNationalId: '2222222222' }),
          user,
        ),
      ).toBe(false)
    })

    it('should refuse a case that did not end in a ruling', () => {
      expect(
        canDefenderAcceptVerdictOf(
          theCase({
            indictmentRulingDecision: CaseIndictmentRulingDecision.FINE,
          }),
          defendant(),
          user,
        ),
      ).toBe(false)
    })
  })

  describe('getVerdictAppealActions', () => {
    const verdict = {
      id: 'verdict_id',
      serviceRequirement: ServiceRequirement.REQUIRED,
      serviceDate: '2026-06-01T13:31:00.000Z',
    }

    it('should offer nothing while the feature is hidden', () => {
      expect(
        getVerdictAppealActions(theCase(), defendant(), user, false),
      ).toEqual([])
    })

    it('should offer to appeal or accept an appealable verdict', () => {
      expect(
        getVerdictAppealActions(theCase(), defendant(), user, true),
      ).toEqual(['APPEAL', 'ACCEPT'])
    })

    it('should offer only to accept once the appeal deadline has passed', () => {
      expect(
        getVerdictAppealActions(
          theCase(),
          defendant({ isVerdictAppealDeadlineExpired: true }),
          user,
          true,
        ),
      ).toEqual(['ACCEPT'])
    })

    it('should still offer to appeal an accepted verdict within the deadline', () => {
      expect(
        getVerdictAppealActions(
          theCase(),
          defendant({
            verdict: {
              ...verdict,
              appealDecision: VerdictAppealDecision.ACCEPT,
            },
          }),
          user,
          true,
        ),
      ).toEqual(['APPEAL'])
    })

    it('should offer only to withdraw an appealed verdict', () => {
      expect(
        getVerdictAppealActions(
          theCase({ verdictAppealCase: { id: 'appeal_case_id' } }),
          defendant({
            verdict: { ...verdict, appealDate: '2026-06-04T13:34:00.000Z' },
          }),
          user,
          true,
        ),
      ).toEqual(['WITHDRAW'])
    })

    it('should offer nothing for a defendant this defender does not represent', () => {
      expect(
        getVerdictAppealActions(
          theCase(),
          defendant({ defenderNationalId: '2222222222' }),
          user,
          true,
        ),
      ).toEqual([])
    })
  })
})
