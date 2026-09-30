import type {
  Case,
  Defendant,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  CaseIndictmentRulingDecision,
  CaseState,
  CaseType,
  ServiceRequirement,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  mockCase,
  mockUser,
} from '@island.is/judicial-system-web/src/utils/mocks'

import {
  canRegisterVerdictAppeal,
  isAfterVerdictAppealDeadline,
  withAppealDefender,
} from './VerdictTimelineCard.logic'

describe('VerdictTimelineCard.logic', () => {
  const publicProsecutorStaff = mockUser(UserRole.PUBLIC_PROSECUTOR_STAFF)

  const completedCase = (overrides: Partial<Case> = {}): Case => ({
    ...mockCase(CaseType.INDICTMENT),
    state: CaseState.COMPLETED,
    indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
    ...overrides,
  })

  const servedDefendant = (overrides: Partial<Defendant> = {}): Defendant => ({
    id: 'defendant_id',
    verdict: {
      id: 'verdict_id',
      serviceRequirement: ServiceRequirement.REQUIRED,
      serviceDate: '2026-08-01T10:00:00.000Z',
    },
    ...overrides,
  })

  describe('canRegisterVerdictAppeal', () => {
    it('allows the public prosecution office to register for a served, unappealed verdict', () => {
      expect(
        canRegisterVerdictAppeal(
          completedCase(),
          servedDefendant(),
          publicProsecutorStaff,
        ),
      ).toBe(true)
    })

    // The office registers appeals that arrive after the deadline too, so an
    // expired deadline does not take the action away.
    it('does not care whether the deadline has run out', () => {
      expect(
        canRegisterVerdictAppeal(
          completedCase(),
          servedDefendant({ isVerdictAppealDeadlineExpired: true }),
          publicProsecutorStaff,
        ),
      ).toBe(true)
    })

    it('denies anyone but the public prosecution office', () => {
      expect(
        canRegisterVerdictAppeal(
          completedCase(),
          servedDefendant(),
          mockUser(UserRole.PROSECUTOR),
        ),
      ).toBe(false)
      expect(
        canRegisterVerdictAppeal(completedCase(), servedDefendant(), undefined),
      ).toBe(false)
    })

    it('denies once the verdict has been appealed', () => {
      expect(
        canRegisterVerdictAppeal(
          completedCase(),
          servedDefendant({
            verdict: {
              id: 'verdict_id',
              serviceRequirement: ServiceRequirement.REQUIRED,
              serviceDate: '2026-08-01T10:00:00.000Z',
              appealDate: '2026-08-16T00:00:00.000Z',
            },
          }),
          publicProsecutorStaff,
        ),
      ).toBe(false)
    })

    it('denies before the verdict has been served', () => {
      expect(
        canRegisterVerdictAppeal(
          completedCase(),
          servedDefendant({
            verdict: {
              id: 'verdict_id',
              serviceRequirement: ServiceRequirement.REQUIRED,
            },
          }),
          publicProsecutorStaff,
        ),
      ).toBe(false)
    })

    it('denies on a case that did not end in a verdict', () => {
      expect(
        canRegisterVerdictAppeal(
          completedCase({
            indictmentRulingDecision: CaseIndictmentRulingDecision.FINE,
          }),
          servedDefendant(),
          publicProsecutorStaff,
        ),
      ).toBe(false)
    })

    it('denies while the case is still open', () => {
      expect(
        canRegisterVerdictAppeal(
          completedCase({ state: CaseState.RECEIVED }),
          servedDefendant(),
          publicProsecutorStaff,
        ),
      ).toBe(false)
    })

    it('denies once the defendant has been sent to prison admin or closed without enforcement', () => {
      expect(
        canRegisterVerdictAppeal(
          completedCase(),
          servedDefendant({ isSentToPrisonAdmin: true }),
          publicProsecutorStaff,
        ),
      ).toBe(false)
      expect(
        canRegisterVerdictAppeal(
          completedCase(),
          servedDefendant({ isClosedWithoutEnforcement: true }),
          publicProsecutorStaff,
        ),
      ).toBe(false)
    })
  })

  describe('isAfterVerdictAppealDeadline', () => {
    const deadline = '2026-08-29T23:59:59.999Z'

    it('is false on the last day of the deadline', () => {
      expect(
        isAfterVerdictAppealDeadline(
          servedDefendant({ verdictAppealDeadline: deadline }),
          new Date('2026-08-29T00:00:00.000Z'),
        ),
      ).toBe(false)
    })

    it('is true the day after', () => {
      expect(
        isAfterVerdictAppealDeadline(
          servedDefendant({ verdictAppealDeadline: deadline }),
          new Date('2026-08-30T00:00:00.000Z'),
        ),
      ).toBe(true)
    })

    it('is false when no deadline is known', () => {
      expect(
        isAfterVerdictAppealDeadline(
          servedDefendant(),
          new Date('2030-01-01T00:00:00.000Z'),
        ),
      ).toBe(false)
    })
  })

  describe('withAppealDefender', () => {
    it('names the appeal defender after the text', () => {
      expect(
        withAppealDefender('Dómfelldi áfrýjaði 16.08.2026', 'Vaka Dagsdóttir'),
      ).toBe('Dómfelldi áfrýjaði 16.08.2026 (Vaka Dagsdóttir verjandi)')
    })

    it('leaves the text alone without one', () => {
      expect(withAppealDefender('Dómfelldi áfrýjaði 16.08.2026', null)).toBe(
        'Dómfelldi áfrýjaði 16.08.2026',
      )
    })
  })
})
