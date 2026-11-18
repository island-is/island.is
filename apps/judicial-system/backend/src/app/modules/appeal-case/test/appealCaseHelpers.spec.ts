import {
  AppealCaseState,
  AppealCourtSessionType,
  AppealEventType,
  CaseFileCategory,
  CaseType,
  InstitutionType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { AppealCase, AppealEventLog, Case, CaseFile } from '../../repository'
import {
  appellantRepresentativeNationalIds,
  findAppealCaseOfCaseFile,
  hasStandingVerdictAppeal,
  nextAppealCourtSession,
  standingVerdictAppellantIds,
  standingVerdictAppellants,
  userIsAppellant,
  verdictAppealProgress,
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

describe('findAppealCaseOfCaseFile', () => {
  const rulingAppeal = { id: 'ruling-appeal' } as AppealCase
  const verdictAppeal = { id: 'verdict-appeal' } as AppealCase
  const rulingOrderAppeal = {
    id: 'ruling-order-appeal',
    rulingFileId: 'ruling-order',
  } as AppealCase
  const theCase = {
    appealCase: rulingAppeal,
    verdictAppealCase: verdictAppeal,
    rulingOrderAppealCases: [rulingOrderAppeal],
  } as Case

  it('finds the ruling-order appeal a file names', () => {
    expect(
      findAppealCaseOfCaseFile(theCase, {
        rulingFileId: 'ruling-order',
        category: CaseFileCategory.DEFENDANT_APPEAL_STATEMENT,
      } as CaseFile),
    ).toBe(rulingOrderAppeal)
  })

  // A verdict appeal is case level like the ruling appeal; its files are
  // told apart by their categories alone.
  it.each([
    CaseFileCategory.DEFENDANT_APPEAL_DECLARATION,
    CaseFileCategory.DEFENDANT_APPEAL_DECLARATION_CASE_FILE,
    CaseFileCategory.DEFENDANT_VERDICT_APPEAL_STATEMENT,
    CaseFileCategory.DEFENDANT_VERDICT_APPEAL_STATEMENT_CASE_FILE,
    CaseFileCategory.PROSECUTOR_VERDICT_APPEAL_STATEMENT,
    CaseFileCategory.PROSECUTOR_VERDICT_APPEAL_STATEMENT_CASE_FILE,
  ])('finds the verdict appeal for %s', (category) => {
    expect(findAppealCaseOfCaseFile(theCase, { category } as CaseFile)).toBe(
      verdictAppeal,
    )
  })

  it('falls back to the case-level ruling appeal for a kæra file', () => {
    expect(
      findAppealCaseOfCaseFile(theCase, {
        category: CaseFileCategory.DEFENDANT_APPEAL_STATEMENT,
      } as CaseFile),
    ).toBe(rulingAppeal)
  })
})

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
    it('is true for the current registered defendant defender', () => {
      const theCase = {
        type: CaseType.CUSTODY,
        defendants: [{ defenderNationalId: '0101010101' }],
      } as Case
      const appealCase = appealCaseWith([
        appealed({ userRole: UserRole.DEFENDER }),
      ])

      expect(userIsAppellant(theCase, appealCase, defender('0101010101'))).toBe(
        true,
      )
    })

    it('is false for a defender who is not registered on any defendant', () => {
      const theCase = {
        type: CaseType.CUSTODY,
        defendants: [{ defenderNationalId: '0101010101' }],
      } as Case
      const appealCase = appealCaseWith([
        appealed({ userRole: UserRole.DEFENDER }),
      ])

      expect(userIsAppellant(theCase, appealCase, defender('9999999999'))).toBe(
        false,
      )
    })

    it('is true when the defender is registered on any of several defendants', () => {
      const theCase = {
        type: CaseType.CUSTODY,
        defendants: [
          { defenderNationalId: '1111111111' },
          { defenderNationalId: '0101010101' },
        ],
      } as Case
      const appealCase = appealCaseWith([
        appealed({ userRole: UserRole.DEFENDER }),
      ])

      expect(userIsAppellant(theCase, appealCase, defender('0101010101'))).toBe(
        true,
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

    // The prosecution appeals a verdict regarding a defendant, so its event
    // names the defendant too; that is not the defendant's appeal.
    it('is false for the defender of a defendant only the prosecution appealed', () => {
      const theCase = {
        type: CaseType.INDICTMENT,
        defendants: [
          {
            id: 'd1',
            isDefenderChoiceConfirmed: true,
            defenderNationalId: '1111111111',
          },
        ],
      } as Case

      expect(
        userIsAppellant(
          theCase,
          appealCaseWith([
            appealed({ userRole: UserRole.PROSECUTOR, defendantId: 'd1' }),
          ]),
          defender('1111111111'),
        ),
      ).toBe(false)
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

    it('is true for the current confirmed appeal defender of a defendant that appealed', () => {
      const theCase = {
        type: CaseType.INDICTMENT,
        defendants: [
          {
            id: 'defendant-id',
            isAppealDefenderConfirmed: true,
            isAppealDefenderWaived: false,
            appealDefenderNationalId: '0101010101',
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

    it('is true for the current confirmed appeal spokesperson of a civil claimant that appealed', () => {
      const theCase = {
        type: CaseType.INDICTMENT,
        civilClaimants: [
          {
            id: 'claimant-id',
            hasAppealSpokesperson: true,
            isAppealSpokespersonConfirmed: true,
            appealSpokespersonNationalId: '0101010101',
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

    it('is false for a waived appeal defender', () => {
      const theCase = {
        type: CaseType.INDICTMENT,
        defendants: [
          {
            id: 'defendant-id',
            isAppealDefenderConfirmed: true,
            isAppealDefenderWaived: true,
            appealDefenderNationalId: '0101010101',
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

  // The defendant whose verdict the prosecution appealed is the one to notify.
  it('does not treat the defendant named on a prosecution appeal as an appellant', () => {
    const theCase = {
      defendants: [{ id: 'd1', defenderNationalId: '1111111111' }],
    } as Case

    expect(
      appellantRepresentativeNationalIds(
        theCase,
        appealCaseWith([
          appealed({ userRole: UserRole.PROSECUTOR, defendantId: 'd1' }),
        ]),
      ),
    ).toEqual(new Set())
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
    userRole: UserRole = UserRole.DEFENDER,
  ) =>
    ({
      defendantId,
      eventType,
      created: new Date(created),
      userRole,
    } as AppealEventLog)

  // The prosecution's appeal regarding a defendant is the other side's appeal,
  // not the defendant's.
  it('does not list a defendant only the prosecution appealed', () => {
    const appealCase = appealCaseWith([
      event(
        'a',
        AppealEventType.APPEALED,
        '2026-06-04T10:00:00Z',
        UserRole.PROSECUTOR,
      ),
    ])

    expect(standingVerdictAppellantIds(appealCase)).toEqual([])
  })

  // An appeal the public prosecution office registered on a letter is the
  // defendant's appeal.
  it('lists a defendant whose appeal the public prosecution office registered', () => {
    const appealCase = appealCaseWith([
      event(
        'a',
        AppealEventType.APPEALED,
        '2026-06-04T10:00:00Z',
        UserRole.PUBLIC_PROSECUTOR_STAFF,
      ),
    ])

    expect(standingVerdictAppellantIds(appealCase)).toEqual(['a'])
  })

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

describe('standingVerdictAppellants', () => {
  const event = (
    defendantId: string,
    eventType: AppealEventType,
    created: string,
    userRole: UserRole,
  ) =>
    ({
      defendantId,
      eventType,
      created: new Date(created),
      userRole,
    } as AppealEventLog)

  // Both sides may appeal the same defendant's verdict; each stands or falls on
  // its own events.
  it('keeps the two sides of one defendant apart', () => {
    const appealCase = appealCaseWith([
      event(
        'a',
        AppealEventType.APPEALED,
        '2026-06-04T10:00:00Z',
        UserRole.DEFENDER,
      ),
      event(
        'a',
        AppealEventType.APPEALED,
        '2026-06-05T10:00:00Z',
        UserRole.PROSECUTOR,
      ),
      event(
        'a',
        AppealEventType.APPEAL_WITHDRAWN,
        '2026-06-06T10:00:00Z',
        UserRole.DEFENDER,
      ),
    ])

    expect(standingVerdictAppellants(appealCase)).toEqual([
      { defendantId: 'a', side: 'PROSECUTION' },
    ])
    expect(hasStandingVerdictAppeal(appealCase, 'a', 'PROSECUTION')).toBe(true)
    expect(hasStandingVerdictAppeal(appealCase, 'a', 'DEFENCE')).toBe(false)
  })

  it('treats a prosecutor representative as the prosecution side', () => {
    const appealCase = appealCaseWith([
      event(
        'a',
        AppealEventType.APPEALED,
        '2026-06-04T10:00:00Z',
        UserRole.PROSECUTOR_REPRESENTATIVE,
      ),
    ])

    expect(standingVerdictAppellants(appealCase)).toEqual([
      { defendantId: 'a', side: 'PROSECUTION' },
    ])
  })

  it('ignores events without a defendant', () => {
    const appealCase = appealCaseWith([
      { eventType: AppealEventType.APPEALED, userRole: UserRole.PROSECUTOR },
    ] as AppealEventLog[])

    expect(standingVerdictAppellants(appealCase)).toEqual([])
  })
})

describe('verdict appeal progress', () => {
  // Built from the clock: whether a session or a deadline is still ahead is the
  // whole question, so fixed dates would pass until they were overtaken.
  const now = new Date()
  const daysFromNow = (days: number) =>
    new Date(now.getTime() + days * 24 * 60 * 60 * 1000)

  const session = (sessionType: AppealCourtSessionType, days: number) => ({
    sessionType,
    sessionDate: daysFromNow(days),
  })
  const deadline = (days: number) => ({ deadline: daysFromNow(days) })

  const appealCase = (fields: Record<string, unknown> = {}): AppealCase =>
    ({ appealState: AppealCaseState.APPEALED, ...fields } as AppealCase)

  it('has no stage before the appeal has been sent to the court of appeals', () => {
    expect(verdictAppealProgress(appealCase(), now)).toBeUndefined()
  })

  it('is sent once a summons has gone to the court of appeals', () => {
    expect(
      verdictAppealProgress(
        appealCase({ sentAppealSummonses: [{ id: 'summons' }] }),
        now,
      ),
    ).toBe('SENT')
  })

  it('is received once the court of appeals has numbered it', () => {
    expect(
      verdictAppealProgress(
        appealCase({
          sentAppealSummonses: [{ id: 'summons' }],
          appealCaseNumber: '526/2026',
        }),
        now,
      ),
    ).toBe('RECEIVED')
  })

  it('is on statement deadlines while one is still running', () => {
    expect(
      verdictAppealProgress(
        appealCase({
          appealCaseNumber: '526/2026',
          statementDeadlines: [deadline(-3), deadline(4)],
        }),
        now,
      ),
    ).toBe('STATEMENT_DEADLINES')
  })

  // The deadlines are a stage the appeal passes through, not a fact about it:
  // once the last one is behind, the appeal is back to having been received.
  it('falls back to received once every deadline has passed', () => {
    expect(
      verdictAppealProgress(
        appealCase({
          appealCaseNumber: '526/2026',
          statementDeadlines: [deadline(-3), deadline(-2)],
        }),
        now,
      ),
    ).toBe('RECEIVED')
  })

  // A deadline is stored as the midnight its day starts on, which is already
  // behind for the whole of that day - and the party has until the day ends.
  it('counts a deadline that falls today as still running', () => {
    const startOfToday = new Date(now)
    startOfToday.setHours(0, 0, 0, 0)

    expect(
      verdictAppealProgress(
        appealCase({
          sentAppealSummonses: [{ id: 'summons' }],
          statementDeadlines: [{ deadline: startOfToday }],
        }),
        now,
      ),
    ).toBe('STATEMENT_DEADLINES')
  })

  it('counts a deadline as passed once its day is over', () => {
    const startOfYesterday = new Date(now)
    startOfYesterday.setHours(0, 0, 0, 0)
    startOfYesterday.setDate(startOfYesterday.getDate() - 1)

    expect(
      verdictAppealProgress(
        appealCase({
          sentAppealSummonses: [{ id: 'summons' }],
          statementDeadlines: [{ deadline: startOfYesterday }],
        }),
        now,
      ),
    ).toBe('SENT')
  })

  it('is scheduled while a session is still ahead, deadlines or not', () => {
    expect(
      verdictAppealProgress(
        appealCase({
          appealCaseNumber: '526/2026',
          statementDeadlines: [deadline(4)],
          courtSessions: [session(AppealCourtSessionType.MAIN_HEARING, 10)],
        }),
        now,
      ),
    ).toBe('SCHEDULED')
  })

  it('does not count a session that has been held', () => {
    expect(
      verdictAppealProgress(
        appealCase({
          appealCaseNumber: '526/2026',
          courtSessions: [session(AppealCourtSessionType.MAIN_HEARING, -2)],
        }),
        now,
      ),
    ).toBe('RECEIVED')
  })

  // None of the stages describes an appeal that is over, and the leftovers of
  // its steps - a number, a session still in the calendar - would say otherwise.
  it.each([AppealCaseState.COMPLETED, AppealCaseState.WITHDRAWN])(
    'has no stage once the appeal is %s',
    (appealState) => {
      expect(
        verdictAppealProgress(
          appealCase({
            appealState,
            appealCaseNumber: '526/2026',
            courtSessions: [session(AppealCourtSessionType.MAIN_HEARING, 10)],
          }),
          now,
        ),
      ).toBeUndefined()
    },
  )

  it('picks the earliest session still ahead as the next one', () => {
    const next = nextAppealCourtSession(
      appealCase({
        courtSessions: [
          session(AppealCourtSessionType.VERDICT, 30),
          session(AppealCourtSessionType.PREPARATORY_HEARING, -5),
          session(AppealCourtSessionType.MAIN_HEARING, 10),
        ],
      }),
      now,
    )

    expect(next?.sessionType).toBe(AppealCourtSessionType.MAIN_HEARING)
  })
})
