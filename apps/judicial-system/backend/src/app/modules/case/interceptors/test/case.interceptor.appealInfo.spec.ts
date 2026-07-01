import each from 'jest-each'

import {
  AppealCaseState,
  AppealEventType,
  CaseAppealDecision,
  CaseFileCategory,
  CaseIndictmentRulingDecision,
  CaseState,
  CaseType,
  UserRole,
} from '@island.is/judicial-system/types'

import { AppealCase, AppealEventLog, Case, CaseFile } from '../../../repository'
import {
  getAppealCaseInfo,
  getAppealCaseStatementDates,
  getIndictmentCaseLevelAppealInfo,
  getRequestCaseLevelAppealInfo,
  getRulingOrderAppealInfo,
} from '../case.interceptor'

describe('getRequestCaseLevelAppealInfo', () => {
  it('returns empty appeal info when no ruling date is provided', () => {
    const theCase = { type: CaseType.CUSTODY } as Case

    expect(getRequestCaseLevelAppealInfo(theCase)).toEqual({})
  })

  it('returns canBeAppealed when prosecutor and defender postponed their decisions', () => {
    const theCase = {
      type: CaseType.CUSTODY,
      rulingDate: new Date('2022-06-15T19:50:08.033Z'),
      accusedAppealDecision: CaseAppealDecision.POSTPONE,
      prosecutorAppealDecision: CaseAppealDecision.POSTPONE,
    } as Case

    const info = getRequestCaseLevelAppealInfo(theCase)

    expect(info).toEqual({
      hasBeenAppealed: false,
      canBeAppealed: true,
      canDefenderAppeal: true,
      canProsecutorAppeal: true,
      appealDeadline: new Date('2022-06-18T19:50:08.033Z'),
      isAppealDeadlineExpired: true,
    })
  })

  it('returns hasBeenAppealed when an appeal exists and the case was not accepted in court', () => {
    const theCase = {
      type: CaseType.CUSTODY,
      rulingDate: new Date('2022-06-15T19:50:08.033Z'),
      accusedAppealDecision: CaseAppealDecision.APPEAL,
      prosecutorAppealDecision: CaseAppealDecision.NOT_APPLICABLE,
      appealCase: { appealState: AppealCaseState.APPEALED } as AppealCase,
    } as Case

    const info = getRequestCaseLevelAppealInfo(theCase)

    expect(info).toEqual({
      hasBeenAppealed: true,
      canBeAppealed: false,
      canDefenderAppeal: false,
      canProsecutorAppeal: false,
      appealDeadline: new Date('2022-06-18T19:50:08.033Z'),
      isAppealDeadlineExpired: true,
    })
  })

  it('treats both parties accepting in court as not appealed even when an appealCase exists', () => {
    const theCase = {
      type: CaseType.CUSTODY,
      rulingDate: new Date('2022-06-15T19:50:08.033Z'),
      accusedAppealDecision: CaseAppealDecision.ACCEPT,
      prosecutorAppealDecision: CaseAppealDecision.ACCEPT,
      appealCase: { appealState: AppealCaseState.APPEALED } as AppealCase,
    } as Case

    const info = getRequestCaseLevelAppealInfo(theCase)

    expect(info).toMatchObject({
      hasBeenAppealed: false,
      canBeAppealed: false,
    })
  })

  each([
    [CaseAppealDecision.POSTPONE, true],
    [CaseAppealDecision.NOT_APPLICABLE, true],
    [CaseAppealDecision.ACCEPT, false],
    [CaseAppealDecision.APPEAL, false],
  ]).it(
    'returns canProsecutorAppeal=%s when prosecutorAppealDecision=%s',
    (decision: CaseAppealDecision, expected: boolean) => {
      const theCase = {
        type: CaseType.CUSTODY,
        rulingDate: new Date('2022-06-15T19:50:08.033Z'),
        prosecutorAppealDecision: decision,
      } as Case

      const info = getRequestCaseLevelAppealInfo(theCase)

      expect(info.canProsecutorAppeal).toBe(expected)
    },
  )

  each([
    [CaseAppealDecision.POSTPONE, true],
    [CaseAppealDecision.NOT_APPLICABLE, true],
    [CaseAppealDecision.ACCEPT, false],
    [CaseAppealDecision.APPEAL, false],
  ]).it(
    'returns canDefenderAppeal=%s when accusedAppealDecision=%s',
    (decision: CaseAppealDecision, expected: boolean) => {
      const theCase = {
        type: CaseType.CUSTODY,
        rulingDate: new Date('2022-06-15T19:50:08.033Z'),
        accusedAppealDecision: decision,
      } as Case

      const info = getRequestCaseLevelAppealInfo(theCase)

      expect(info.canDefenderAppeal).toBe(expected)
    },
  )
})

describe('getIndictmentCaseLevelAppealInfo', () => {
  it('returns empty appeal info when ruling decision is not DISMISSAL', () => {
    const theCase = {
      type: CaseType.INDICTMENT,
      indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
      rulingDate: new Date('2022-06-15T19:50:08.033Z'),
    } as Case

    expect(getIndictmentCaseLevelAppealInfo(theCase)).toEqual({})
  })

  it('returns empty appeal info when no ruling date', () => {
    const theCase = {
      type: CaseType.INDICTMENT,
      indictmentRulingDecision: CaseIndictmentRulingDecision.DISMISSAL,
    } as Case

    expect(getIndictmentCaseLevelAppealInfo(theCase)).toEqual({})
  })

  it('returns canBeAppealed when an indictment dismissal has not been appealed', () => {
    const theCase = {
      type: CaseType.INDICTMENT,
      indictmentRulingDecision: CaseIndictmentRulingDecision.DISMISSAL,
      rulingDate: new Date('2022-06-15T19:50:08.033Z'),
    } as Case

    expect(getIndictmentCaseLevelAppealInfo(theCase)).toEqual({
      hasBeenAppealed: false,
      canBeAppealed: true,
      canProsecutorAppeal: true,
      canDefenderAppeal: true,
      appealDeadline: new Date('2022-06-18T19:50:08.033Z'),
      isAppealDeadlineExpired: true,
    })
  })

  it('returns hasBeenAppealed when an indictment dismissal has been appealed', () => {
    const theCase = {
      type: CaseType.INDICTMENT,
      indictmentRulingDecision: CaseIndictmentRulingDecision.DISMISSAL,
      rulingDate: new Date('2022-06-15T19:50:08.033Z'),
      appealCase: { appealState: AppealCaseState.APPEALED } as AppealCase,
    } as Case

    expect(getIndictmentCaseLevelAppealInfo(theCase)).toEqual({
      hasBeenAppealed: true,
      canBeAppealed: false,
      canProsecutorAppeal: false,
      canDefenderAppeal: false,
      appealDeadline: new Date('2022-06-18T19:50:08.033Z'),
      isAppealDeadlineExpired: true,
    })
  })

  it('returns isAppealDeadlineExpired=false when the deadline is in the future', () => {
    const rulingDate = new Date()
    rulingDate.setSeconds(rulingDate.getSeconds() + 100)
    const theCase = {
      type: CaseType.INDICTMENT,
      indictmentRulingDecision: CaseIndictmentRulingDecision.DISMISSAL,
      rulingDate,
    } as Case

    expect(
      getIndictmentCaseLevelAppealInfo(theCase).isAppealDeadlineExpired,
    ).toBe(false)
  })
})

describe('getAppealCaseInfo', () => {
  describe('case-level appeals (rulingFileId is null)', () => {
    it('attributes the appeal to the prosecutor when prosecutorPostponedAppealDate is set', () => {
      const prosecutorPostponedAppealDate = new Date('2022-06-15T19:50:08.033Z')
      const theCase = {
        type: CaseType.CUSTODY,
        prosecutorPostponedAppealDate,
      } as Case
      const appealCase = {} as AppealCase

      expect(getAppealCaseInfo(appealCase, theCase)).toEqual({
        appealedByRole: UserRole.PROSECUTOR,
        appealedDate: prosecutorPostponedAppealDate,
        appealedInCourt: false,
        statementDeadline: undefined,
        isStatementDeadlineExpired: undefined,
      })
    })

    it('attributes the appeal to the defender when accusedPostponedAppealDate is set', () => {
      const accusedPostponedAppealDate = new Date('2022-06-15T19:50:08.033Z')
      const theCase = {
        type: CaseType.CUSTODY,
        accusedPostponedAppealDate,
      } as Case
      const appealCase = {} as AppealCase

      expect(getAppealCaseInfo(appealCase, theCase)).toEqual({
        appealedByRole: UserRole.DEFENDER,
        appealedDate: accusedPostponedAppealDate,
        appealedInCourt: false,
        statementDeadline: undefined,
        isStatementDeadlineExpired: undefined,
      })
    })

    it('ignores postponed-appeal dates that match an in-court ACCEPT decision (request cases)', () => {
      const theCase = {
        type: CaseType.CUSTODY,
        prosecutorAppealDecision: CaseAppealDecision.ACCEPT,
        accusedAppealDecision: CaseAppealDecision.ACCEPT,
        prosecutorPostponedAppealDate: new Date('2022-06-15T19:50:08.033Z'),
        accusedPostponedAppealDate: new Date('2022-06-15T19:50:08.033Z'),
      } as Case
      const appealCase = {} as AppealCase

      expect(getAppealCaseInfo(appealCase, theCase)).toMatchObject({
        appealedByRole: undefined,
        appealedDate: undefined,
      })
    })

    it('returns statement deadline + expired flag when the appeal has been received by the court', () => {
      const theCase = {
        type: CaseType.CUSTODY,
        prosecutorPostponedAppealDate: new Date('2022-06-15T19:50:08.033Z'),
      } as Case
      const appealCase = {
        appealReceivedByCourtDate: new Date('2022-06-17T12:00:00.000Z'),
      } as AppealCase

      const info = getAppealCaseInfo(appealCase, theCase)

      expect(info.statementDeadline).toEqual(
        new Date('2022-06-18T12:00:00.000Z'),
      )
      expect(info.isStatementDeadlineExpired).toBe(true)
    })
  })

  describe('ruling-order appeals (rulingFileId is set)', () => {
    it('attributes the appeal to the defender when appealedByNationalId is set', () => {
      const created = new Date('2026-04-01T12:00:00.000Z')
      const theCase = { type: CaseType.INDICTMENT } as Case
      const appealCase = {
        rulingFileId: 'file-id',
        appealedByNationalId: '0101011010',
        created,
      } as AppealCase

      expect(getAppealCaseInfo(appealCase, theCase)).toMatchObject({
        appealedByRole: UserRole.DEFENDER,
        appealedDate: created,
      })
    })

    it('attributes the appeal to the prosecutor when no appealedByNationalId is set', () => {
      const created = new Date('2026-04-01T12:00:00.000Z')
      const theCase = { type: CaseType.INDICTMENT } as Case
      const appealCase = {
        rulingFileId: 'file-id',
        created,
      } as AppealCase

      expect(getAppealCaseInfo(appealCase, theCase)).toMatchObject({
        appealedByRole: UserRole.PROSECUTOR,
        appealedDate: created,
      })
    })

    it('uses appealReceivedByCourtDate for the statement deadline', () => {
      const theCase = { type: CaseType.INDICTMENT } as Case
      const appealCase = {
        rulingFileId: 'file-id',
        appealReceivedByCourtDate: new Date('2026-04-02T12:00:00.000Z'),
        created: new Date('2026-04-01T12:00:00.000Z'),
      } as AppealCase

      expect(getAppealCaseInfo(appealCase, theCase).statementDeadline).toEqual(
        new Date('2026-04-03T12:00:00.000Z'),
      )
    })

    it('is appealedInCourt when a decision = APPEAL exists for the ruling', () => {
      const theCase = {
        type: CaseType.INDICTMENT,
        appealDecisions: [
          { rulingFileId: 'file-id', decision: CaseAppealDecision.APPEAL },
        ],
      } as Case
      const appealCase = { rulingFileId: 'file-id' } as AppealCase

      expect(getAppealCaseInfo(appealCase, theCase).appealedInCourt).toBe(true)
    })

    it('is not appealedInCourt when only other rulings or non-APPEAL decisions exist', () => {
      const theCase = {
        type: CaseType.INDICTMENT,
        appealDecisions: [
          { rulingFileId: 'other-file', decision: CaseAppealDecision.APPEAL },
          { rulingFileId: 'file-id', decision: CaseAppealDecision.ACCEPT },
        ],
      } as Case
      const appealCase = { rulingFileId: 'file-id' } as AppealCase

      expect(getAppealCaseInfo(appealCase, theCase).appealedInCourt).toBe(false)
    })
  })
})

describe('getRulingOrderAppealInfo', () => {
  it('returns empty info for non-ruling-order files', () => {
    const caseFile = {
      id: 'file-id',
      category: CaseFileCategory.PROSECUTOR_APPEAL_BRIEF,
    } as CaseFile

    expect(getRulingOrderAppealInfo(caseFile, {} as Case)).toEqual({})
  })

  it('returns canBeAppealed true when no appeal exists and the case is not completed', () => {
    const caseFile = {
      id: 'file-id',
      category: CaseFileCategory.COURT_INDICTMENT_RULING_ORDER,
    } as CaseFile
    const theCase = {
      state: CaseState.RECEIVED,
      rulingOrderAppealCases: [],
      courtSessions: [
        {
          isConfirmed: true,
          rulingFileId: 'file-id',
          endDate: new Date('2020-01-01T00:00:00.000Z'),
        },
      ],
    } as unknown as Case

    const info = getRulingOrderAppealInfo(caseFile, theCase)

    expect(info).toMatchObject({
      hasBeenAppealed: false,
      canBeAppealed: true,
      isAppealDeadlineExpired: true,
    })
    expect(info.appealDeadline).toBeInstanceOf(Date)
  })

  it('derives the appeal deadline from the confirmed court session end date', () => {
    const caseFile = {
      id: 'file-id',
      category: CaseFileCategory.COURT_INDICTMENT_RULING_ORDER,
    } as CaseFile
    const endDate = new Date('2026-04-01T12:00:00.000Z')
    const theCase = {
      state: CaseState.RECEIVED,
      rulingOrderAppealCases: [],
      courtSessions: [{ isConfirmed: true, rulingFileId: 'file-id', endDate }],
    } as unknown as Case

    // The appeal deadline is three days after the ruling time (end of session)
    expect(getRulingOrderAppealInfo(caseFile, theCase).appealDeadline).toEqual(
      new Date('2026-04-04T12:00:00.000Z'),
    )
  })

  it('has no appeal deadline until the ruling order is in a confirmed court session', () => {
    const caseFile = {
      id: 'file-id',
      category: CaseFileCategory.COURT_INDICTMENT_RULING_ORDER,
    } as CaseFile
    const theCase = {
      state: CaseState.RECEIVED,
      rulingOrderAppealCases: [],
      courtSessions: [
        // Same ruling file, but the session is not confirmed yet
        {
          isConfirmed: false,
          rulingFileId: 'file-id',
          endDate: new Date('2026-04-01T12:00:00.000Z'),
        },
      ],
    } as unknown as Case

    const info = getRulingOrderAppealInfo(caseFile, theCase)

    expect(info.appealDeadline).toBeUndefined()
    expect(info.isAppealDeadlineExpired).toBeUndefined()
  })

  it('returns hasBeenAppealed true when an appeal exists for this ruling file', () => {
    const caseFile = {
      id: 'file-id',
      category: CaseFileCategory.COURT_INDICTMENT_RULING_ORDER,
      submissionDate: new Date('2026-04-01T12:00:00.000Z'),
    } as CaseFile
    const theCase = {
      state: CaseState.RECEIVED,
      rulingOrderAppealCases: [{ rulingFileId: 'file-id' } as AppealCase],
    } as unknown as Case

    expect(getRulingOrderAppealInfo(caseFile, theCase)).toMatchObject({
      hasBeenAppealed: true,
      canBeAppealed: false,
    })
  })

  it('returns canBeAppealed false when the case is completed', () => {
    const caseFile = {
      id: 'file-id',
      category: CaseFileCategory.COURT_INDICTMENT_RULING_ORDER,
      submissionDate: new Date('2026-04-01T12:00:00.000Z'),
    } as CaseFile
    const theCase = {
      state: CaseState.COMPLETED,
      rulingOrderAppealCases: [],
    } as unknown as Case

    expect(getRulingOrderAppealInfo(caseFile, theCase)).toMatchObject({
      hasBeenAppealed: false,
      canBeAppealed: false,
    })
  })

  it('does not gate canBeAppealed by the soft deadline', () => {
    const caseFile = {
      id: 'file-id',
      category: CaseFileCategory.COURT_INDICTMENT_RULING_ORDER,
    } as CaseFile
    const theCase = {
      state: CaseState.RECEIVED,
      rulingOrderAppealCases: [],
      courtSessions: [
        {
          isConfirmed: true,
          rulingFileId: 'file-id',
          endDate: new Date('1900-01-01T00:00:00.000Z'),
        },
      ],
    } as unknown as Case

    const info = getRulingOrderAppealInfo(caseFile, theCase)

    expect(info.isAppealDeadlineExpired).toBe(true)
    expect(info.canBeAppealed).toBe(true)
  })
})

describe('getAppealCaseStatementDates', () => {
  const earlier = new Date('2026-04-01T12:00:00.000Z')
  const later = new Date('2026-04-03T12:00:00.000Z')

  describe('request cases', () => {
    it('returns the latest prosecutor and defender statement dates', () => {
      const appealCase = {
        appealEventLogs: [
          {
            eventType: AppealEventType.APPEAL_STATEMENT_SENT,
            userRole: UserRole.PROSECUTOR,
            created: earlier,
          },
          {
            eventType: AppealEventType.APPEAL_STATEMENT_SENT,
            userRole: UserRole.PROSECUTOR,
            created: later,
          },
          {
            eventType: AppealEventType.APPEAL_STATEMENT_SENT,
            userRole: UserRole.DEFENDER,
            created: earlier,
          },
          {
            eventType: AppealEventType.APPEAL_STATEMENT_SENT,
            userRole: UserRole.DEFENDER,
            created: later,
          },
        ] as AppealEventLog[],
      } as AppealCase
      const theCase = { type: CaseType.CUSTODY } as Case

      expect(getAppealCaseStatementDates(appealCase, theCase)).toEqual({
        prosecutorStatementDate: later,
        defendantStatementDate: later,
      })
    })

    it('omits the indictment-only list fields', () => {
      const appealCase = { appealEventLogs: [] } as unknown as AppealCase
      const theCase = { type: CaseType.CUSTODY } as Case

      const dates = getAppealCaseStatementDates(appealCase, theCase)

      expect(dates).not.toHaveProperty('defendantStatementDates')
      expect(dates).not.toHaveProperty('civilClaimantStatementDates')
    })

    it('returns undefined dates when there are no events', () => {
      const appealCase = { appealEventLogs: [] } as unknown as AppealCase
      const theCase = { type: CaseType.CUSTODY } as Case

      expect(getAppealCaseStatementDates(appealCase, theCase)).toEqual({
        prosecutorStatementDate: undefined,
        defendantStatementDate: undefined,
      })
    })
  })

  describe('indictment cases', () => {
    it('groups defendant statements by defendantId, keeping the latest event per defendant', () => {
      const appealCase = {
        appealEventLogs: [
          {
            eventType: AppealEventType.APPEAL_STATEMENT_SENT,
            userRole: UserRole.DEFENDER,
            defendantId: 'defendant-1',
            created: earlier,
          },
          {
            eventType: AppealEventType.APPEAL_STATEMENT_SENT,
            userRole: UserRole.DEFENDER,
            defendantId: 'defendant-1',
            created: later,
          },
          {
            eventType: AppealEventType.APPEAL_STATEMENT_SENT,
            userRole: UserRole.DEFENDER,
            defendantId: 'defendant-2',
            created: earlier,
          },
        ] as AppealEventLog[],
      } as AppealCase
      const theCase = { type: CaseType.INDICTMENT } as Case

      const dates = getAppealCaseStatementDates(appealCase, theCase)

      expect(dates.defendantStatementDates).toEqual(
        expect.arrayContaining([
          { defendantId: 'defendant-1', statementDate: later },
          { defendantId: 'defendant-2', statementDate: earlier },
        ]),
      )
      expect(dates.defendantStatementDates).toHaveLength(2)
    })

    it('groups civil-claimant statements by civilClaimantId, keeping the latest event per claimant', () => {
      const appealCase = {
        appealEventLogs: [
          {
            eventType: AppealEventType.APPEAL_STATEMENT_SENT,
            userRole: UserRole.DEFENDER,
            civilClaimantId: 'claimant-1',
            created: earlier,
          },
          {
            eventType: AppealEventType.APPEAL_STATEMENT_SENT,
            userRole: UserRole.DEFENDER,
            civilClaimantId: 'claimant-1',
            created: later,
          },
        ] as AppealEventLog[],
      } as AppealCase
      const theCase = { type: CaseType.INDICTMENT } as Case

      expect(
        getAppealCaseStatementDates(appealCase, theCase)
          .civilClaimantStatementDates,
      ).toEqual([{ civilClaimantId: 'claimant-1', statementDate: later }])
    })

    it('drops events without a defendantId or civilClaimantId from the lists', () => {
      const appealCase = {
        appealEventLogs: [
          {
            eventType: AppealEventType.APPEAL_STATEMENT_SENT,
            userRole: UserRole.DEFENDER,
            created: earlier,
          },
        ] as AppealEventLog[],
      } as AppealCase
      const theCase = { type: CaseType.INDICTMENT } as Case

      const dates = getAppealCaseStatementDates(appealCase, theCase)

      expect(dates.defendantStatementDates).toEqual([])
      expect(dates.civilClaimantStatementDates).toEqual([])
    })

    it('returns the latest prosecutor statement date across prosecution roles', () => {
      const appealCase = {
        appealEventLogs: [
          {
            eventType: AppealEventType.APPEAL_STATEMENT_SENT,
            userRole: UserRole.PROSECUTOR,
            created: earlier,
          },
          {
            eventType: AppealEventType.APPEAL_STATEMENT_SENT,
            userRole: UserRole.PROSECUTOR_REPRESENTATIVE,
            created: later,
          },
        ] as AppealEventLog[],
      } as AppealCase
      const theCase = { type: CaseType.INDICTMENT } as Case

      expect(
        getAppealCaseStatementDates(appealCase, theCase)
          .prosecutorStatementDate,
      ).toEqual(later)
    })

    it('omits the singular defendantStatementDate', () => {
      const appealCase = { appealEventLogs: [] } as unknown as AppealCase
      const theCase = { type: CaseType.INDICTMENT } as Case

      const dates = getAppealCaseStatementDates(appealCase, theCase)

      expect(dates).not.toHaveProperty('defendantStatementDate')
    })
  })

  describe('per-appeal scoping', () => {
    it("only reads from the appeal-case row's own event logs", () => {
      const appealA = {
        appealEventLogs: [
          {
            eventType: AppealEventType.APPEAL_STATEMENT_SENT,
            userRole: UserRole.DEFENDER,
            defendantId: 'defendant-1',
            created: later,
          },
        ] as AppealEventLog[],
      } as AppealCase
      const appealB = { appealEventLogs: [] } as unknown as AppealCase
      const theCase = { type: CaseType.INDICTMENT } as Case

      expect(
        getAppealCaseStatementDates(appealA, theCase).defendantStatementDates,
      ).toEqual([{ defendantId: 'defendant-1', statementDate: later }])
      expect(
        getAppealCaseStatementDates(appealB, theCase).defendantStatementDates,
      ).toEqual([])
    })
  })
})
