import {
  AppealEventType,
  CaseType,
  InstitutionType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { AppealCase, AppealEventLog, Case } from '../../repository'
import {
  appellantRepresentativeNationalIds,
  standingVerdictAppellantIds,
  userIsAppellant,
} from '../appealCase.helpers'

const appealed = (fields: Partial<AppealEventLog> = {}): AppealEventLog =>
  ({ eventType: AppealEventType.APPEALED, ...fields } as AppealEventLog)

const appealCaseWith = (events: AppealEventLog[]): AppealCase =>
  ({ appealEventLogs: events } as AppealCase)

const prosecutor = {
  role: UserRole.PROSECUTOR,
  nationalId: '0000000000',
  institution: { type: InstitutionType.POLICE_PROSECUTORS_OFFICE },
} as User

const defender = (nationalId: string) =>
  ({ role: UserRole.DEFENDER, nationalId } as User)

describe('userIsAppellant', () => {
  it('is false when the appeal case has no APPEALED event', () => {
    const theCase = { type: CaseType.INDICTMENT } as Case

    expect(userIsAppellant(theCase, appealCaseWith([]), prosecutor)).toBe(false)
  })

  describe('prosecution', () => {
    const theCase = { type: CaseType.CUSTODY } as Case

    it('is true when a prosecution APPEALED event exists', () => {
      const appealCase = appealCaseWith([
        appealed({ userRole: UserRole.PROSECUTOR }),
      ])

      expect(userIsAppellant(theCase, appealCase, prosecutor)).toBe(true)
    })

    it('is false when only the defence appealed', () => {
      const appealCase = appealCaseWith([
        appealed({ userRole: UserRole.DEFENDER }),
      ])

      expect(userIsAppellant(theCase, appealCase, prosecutor)).toBe(false)
    })
  })

  describe('request-case defence (collective)', () => {
    it('is true for the current registered case defender', () => {
      const theCase = {
        type: CaseType.CUSTODY,
        defenderNationalId: '0101010101',
      } as Case
      const appealCase = appealCaseWith([
        appealed({ userRole: UserRole.DEFENDER }),
      ])

      expect(userIsAppellant(theCase, appealCase, defender('0101010101'))).toBe(
        true,
      )
    })

    it('is false for a defender who is not the current case defender', () => {
      const theCase = {
        type: CaseType.CUSTODY,
        defenderNationalId: '0101010101',
      } as Case
      const appealCase = appealCaseWith([
        appealed({ userRole: UserRole.DEFENDER }),
      ])

      expect(userIsAppellant(theCase, appealCase, defender('9999999999'))).toBe(
        false,
      )
    })
  })

  describe('indictment defence (per party)', () => {
    it('is true for the current confirmed defender of a defendant that appealed', () => {
      const theCase = {
        type: CaseType.INDICTMENT,
        defendants: [
          {
            id: 'defendant-id',
            isDefenderChoiceConfirmed: true,
            defenderNationalId: '0101010101',
          },
        ],
      } as Case
      const appealCase = appealCaseWith([
        appealed({ userRole: UserRole.DEFENDER, defendantId: 'defendant-id' }),
      ])

      expect(userIsAppellant(theCase, appealCase, defender('0101010101'))).toBe(
        true,
      )
    })

    it('is true for the current confirmed spokesperson of a civil claimant that appealed', () => {
      const theCase = {
        type: CaseType.INDICTMENT,
        civilClaimants: [
          {
            id: 'claimant-id',
            hasSpokesperson: true,
            isSpokespersonConfirmed: true,
            spokespersonNationalId: '0101010101',
          },
        ],
      } as Case
      const appealCase = appealCaseWith([
        appealed({
          userRole: UserRole.DEFENDER,
          civilClaimantId: 'claimant-id',
        }),
      ])

      expect(userIsAppellant(theCase, appealCase, defender('0101010101'))).toBe(
        true,
      )
    })

    it('is false when the user represents a different party than the one that appealed', () => {
      const theCase = {
        type: CaseType.INDICTMENT,
        defendants: [
          {
            id: 'defendant-id',
            isDefenderChoiceConfirmed: true,
            defenderNationalId: '0101010101',
          },
        ],
      } as Case
      const appealCase = appealCaseWith([
        appealed({ userRole: UserRole.DEFENDER, defendantId: 'other-id' }),
      ])

      expect(userIsAppellant(theCase, appealCase, defender('0101010101'))).toBe(
        false,
      )
    })

    it('is false when the defender choice is not confirmed', () => {
      const theCase = {
        type: CaseType.INDICTMENT,
        defendants: [
          {
            id: 'defendant-id',
            isDefenderChoiceConfirmed: false,
            defenderNationalId: '0101010101',
          },
        ],
      } as Case
      const appealCase = appealCaseWith([
        appealed({ userRole: UserRole.DEFENDER, defendantId: 'defendant-id' }),
      ])

      expect(userIsAppellant(theCase, appealCase, defender('0101010101'))).toBe(
        false,
      )
    })
  })
})

describe('appellantRepresentativeNationalIds', () => {
  it('resolves to the current defender of the appellant defendant (survives a swap)', () => {
    const theCase = {
      type: CaseType.INDICTMENT,
      // defendant appealed via an earlier defender, now represented by a new one
      defendants: [{ id: 'defendant-id', defenderNationalId: 'new-defender' }],
    } as Case
    const appealCase = appealCaseWith([
      appealed({ userRole: UserRole.DEFENDER, defendantId: 'defendant-id' }),
    ])

    expect([
      ...appellantRepresentativeNationalIds(theCase, appealCase),
    ]).toEqual(['new-defender'])
  })

  it('resolves to the current spokesperson of the appellant civil claimant', () => {
    const theCase = {
      type: CaseType.INDICTMENT,
      civilClaimants: [
        { id: 'claimant-id', spokespersonNationalId: 'spokesperson' },
      ],
    } as Case
    const appealCase = appealCaseWith([
      appealed({ userRole: UserRole.DEFENDER, civilClaimantId: 'claimant-id' }),
    ])

    expect([
      ...appellantRepresentativeNationalIds(theCase, appealCase),
    ]).toEqual(['spokesperson'])
  })

  it('is empty for a prosecution appeal (no defence party on the event)', () => {
    const theCase = { type: CaseType.INDICTMENT, defendants: [] } as Case
    const appealCase = appealCaseWith([
      appealed({ userRole: UserRole.PROSECUTOR }),
    ])

    expect(appellantRepresentativeNationalIds(theCase, appealCase).size).toBe(0)
  })

  it('collects every appellant when several parties appealed', () => {
    const theCase = {
      type: CaseType.INDICTMENT,
      defendants: [
        { id: 'd1', defenderNationalId: 'defender-1' },
        { id: 'd2', defenderNationalId: 'defender-2' },
      ],
    } as Case
    const appealCase = appealCaseWith([
      appealed({ userRole: UserRole.DEFENDER, defendantId: 'd1' }),
      appealed({ userRole: UserRole.DEFENDER, defendantId: 'd2' }),
    ])

    expect(
      [...appellantRepresentativeNationalIds(theCase, appealCase)].sort(),
    ).toEqual(['defender-1', 'defender-2'])
  })
})

describe('standingVerdictAppellantIds', () => {
  const event = (
    defendantId: string,
    eventType: AppealEventType,
    created: string,
  ) =>
    ({ defendantId, eventType, created: new Date(created) } as AppealEventLog)

  it('is empty when nothing has been appealed', () => {
    expect(standingVerdictAppellantIds(appealCaseWith([]))).toEqual([])
  })

  it('lists every defendant that appealed', () => {
    const appealCase = appealCaseWith([
      event('a', AppealEventType.APPEALED, '2026-06-04T10:00:00Z'),
      event('b', AppealEventType.APPEALED, '2026-06-05T10:00:00Z'),
    ])

    expect(standingVerdictAppellantIds(appealCase).sort()).toEqual(['a', 'b'])
  })

  it('drops a defendant that withdrew', () => {
    const appealCase = appealCaseWith([
      event('a', AppealEventType.APPEALED, '2026-06-04T10:00:00Z'),
      event('b', AppealEventType.APPEALED, '2026-06-05T10:00:00Z'),
      event('a', AppealEventType.APPEAL_WITHDRAWN, '2026-06-06T10:00:00Z'),
    ])

    expect(standingVerdictAppellantIds(appealCase)).toEqual(['b'])
  })

  // A defendant may appeal again while the deadline still runs, so it is the
  // latest event that decides rather than the presence of a withdrawal.
  it('keeps a defendant that appealed again after withdrawing', () => {
    const appealCase = appealCaseWith([
      event('a', AppealEventType.APPEALED, '2026-06-04T10:00:00Z'),
      event('a', AppealEventType.APPEAL_WITHDRAWN, '2026-06-05T10:00:00Z'),
      event('a', AppealEventType.APPEALED, '2026-06-06T10:00:00Z'),
    ])

    expect(standingVerdictAppellantIds(appealCase)).toEqual(['a'])
  })

  it('ignores events that are not about appealing or withdrawing', () => {
    const appealCase = appealCaseWith([
      event('a', AppealEventType.APPEAL_STATEMENT_SENT, '2026-06-04T10:00:00Z'),
    ])

    expect(standingVerdictAppellantIds(appealCase)).toEqual([])
  })
})
