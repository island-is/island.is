import type {
  Case,
  Defendant,
  User,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  CaseIndictmentRulingDecision,
  CaseState,
  ServiceRequirement,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'

import {
  canDefenderAppealVerdictOf,
  canDefenderWithdrawVerdictAppealOf,
  getVerdictAppealAction,
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

  const theCase = (overrides: Partial<Case> = {}): Case =>
    ({
      id: 'case_id',
      state: CaseState.COMPLETED,
      indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
      ...overrides,
    } as Case)

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

  describe('getVerdictAppealAction', () => {
    it('should offer nothing while the feature is hidden', () => {
      expect(
        getVerdictAppealAction(theCase(), defendant(), user, false),
      ).toBeUndefined()
    })

    it('should offer to appeal an appealable verdict', () => {
      expect(getVerdictAppealAction(theCase(), defendant(), user, true)).toBe(
        'APPEAL',
      )
    })

    it('should offer to withdraw an appealed verdict', () => {
      expect(
        getVerdictAppealAction(
          theCase({ verdictAppealCase: { id: 'appeal_case_id' } }),
          defendant({
            verdict: {
              id: 'verdict_id',
              serviceRequirement: ServiceRequirement.REQUIRED,
              serviceDate: '2026-06-01T13:31:00.000Z',
              appealDate: '2026-06-04T13:34:00.000Z',
            },
          }),
          user,
          true,
        ),
      ).toBe('WITHDRAW')
    })

    it('should offer nothing for a defendant this defender does not represent', () => {
      expect(
        getVerdictAppealAction(
          theCase(),
          defendant({ defenderNationalId: '2222222222' }),
          user,
          true,
        ),
      ).toBeUndefined()
    })
  })
})
