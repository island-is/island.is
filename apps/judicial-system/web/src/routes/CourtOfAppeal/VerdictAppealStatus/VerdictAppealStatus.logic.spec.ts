import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import {
  AppealCaseState,
  AppealCaseType,
  AppealCourtSessionType,
  AppealEventType,
  UserRole,
  VerdictAppealStatus,
} from '@island.is/judicial-system-web/src/graphql/schema'

import type { AppealCourtSessionDraft } from './VerdictAppealStatus.logic'
import {
  formatAppealCourtSessionDetails,
  getInitialVerdictAppealStatus,
  getVerdictAppealStatusHeaderLines,
  isAppealCourtSessionComplete,
  isAppealCourtSessionEmpty,
  toAppealCourtSessionDraft,
  withRulingDocumentChanged,
} from './VerdictAppealStatus.logic'

describe('getVerdictAppealStatusHeaderLines', () => {
  it('names the district court case and who appealed when', () => {
    const lines = getVerdictAppealStatusHeaderLines({
      courtCaseNumber: 'S-123/2026',
      defendants: [
        { id: 'd1', verdict: { appealDate: '2026-06-04T10:00:00.000Z' } },
      ],
      verdictAppealCase: {
        id: 'verdict-appeal',
        appealEventLogs: [
          {
            id: 'e1',
            eventType: AppealEventType.APPEALED,
            created: '2026-06-10T10:00:00.000Z',
            defendantId: 'd1',
            userRole: UserRole.PROSECUTOR,
          },
        ],
      },
    } as unknown as WorkingCase)

    expect(lines).toEqual([
      'Málsnr. héraðsdóms S-123/2026',
      'Dómfelldi áfrýjaði 4. júní 2026',
      'Ákæruvaldið áfrýjaði 10. júní 2026',
    ])
  })

  // A case with two defendants carries the prosecution's appeal once per
  // defendant. The header is about the proceeding, so one line is enough.
  it('does not repeat a line two defendants share', () => {
    const lines = getVerdictAppealStatusHeaderLines({
      courtCaseNumber: 'S-123/2026',
      defendants: [
        { id: 'd1', verdict: { appealDate: '2026-06-04T10:00:00.000Z' } },
        { id: 'd2', verdict: { appealDate: '2026-06-04T12:00:00.000Z' } },
      ],
      verdictAppealCase: { id: 'verdict-appeal', appealEventLogs: [] },
    } as unknown as WorkingCase)

    expect(lines).toEqual([
      'Málsnr. héraðsdóms S-123/2026',
      'Dómfelldi áfrýjaði 4. júní 2026',
    ])
  })

  it('says only what is known', () => {
    expect(
      getVerdictAppealStatusHeaderLines({
        defendants: [{ id: 'd1' }],
      } as unknown as WorkingCase),
    ).toEqual([])
  })
})

describe('court session draft', () => {
  const session: AppealCourtSessionDraft = {
    sessionType: AppealCourtSessionType.MAIN_HEARING,
    sessionDate: new Date(2026, 11, 12, 14, 0),
    courtRoom: '1',
  }

  it('is complete only with a type, a date and a court room', () => {
    expect(isAppealCourtSessionComplete(session)).toBe(true)
    expect(
      isAppealCourtSessionComplete({ ...session, sessionType: undefined }),
    ).toBe(false)
    expect(
      isAppealCourtSessionComplete({ ...session, sessionDate: undefined }),
    ).toBe(false)
    expect(isAppealCourtSessionComplete({ ...session, courtRoom: ' ' })).toBe(
      false,
    )
    // The date is kept while the time field is being corrected or cleared;
    // the flag is what says the field is not filled in.
    expect(
      isAppealCourtSessionComplete({ ...session, isSessionDateValid: false }),
    ).toBe(false)
  })

  it('is empty only when nothing has been entered', () => {
    expect(isAppealCourtSessionEmpty({})).toBe(true)
    expect(isAppealCourtSessionEmpty({ courtRoom: ' ' })).toBe(true)
    expect(isAppealCourtSessionEmpty({ courtRoom: '1' })).toBe(false)
    expect(isAppealCourtSessionEmpty(session)).toBe(false)
  })

  it('formats the details line the way the design reads it', () => {
    expect(formatAppealCourtSessionDetails(session)).toBe(
      '12.12.2026 kl. 14:00 · Dómsalur 1',
    )
    expect(
      formatAppealCourtSessionDetails({
        sessionDate: '2026-12-12T14:00:00.000Z',
        courtRoom: '1',
      }),
    ).toMatch(/^12\.12\.2026 kl\. \d\d:\d\d · Dómsalur 1$/)
  })

  it('turns a booked session into a draft the form can hold', () => {
    const draft = toAppealCourtSessionDraft({
      sessionType: AppealCourtSessionType.VERDICT,
      sessionDate: '2026-12-12T14:00:00.000Z',
      courtRoom: '1',
    })

    expect(draft.sessionType).toBe(AppealCourtSessionType.VERDICT)
    expect(draft.sessionDate).toEqual(new Date('2026-12-12T14:00:00.000Z'))
    expect(draft.courtRoom).toBe('1')
    expect(isAppealCourtSessionComplete(draft)).toBe(true)
  })

  it('leaves out what the booked session lacks', () => {
    expect(toAppealCourtSessionDraft({ courtRoom: null })).toEqual({
      sessionType: undefined,
      sessionDate: undefined,
      courtRoom: undefined,
    })
  })
})

describe('getInitialVerdictAppealStatus', () => {
  const session = { id: 'session-1' }

  it('is the saved status, sessions or not', () => {
    expect(
      getInitialVerdictAppealStatus({
        verdictAppealStatus: VerdictAppealStatus.UNDER_ADVISEMENT,
        courtSessions: [session],
      }),
    ).toBe(VerdictAppealStatus.UNDER_ADVISEMENT)
  })

  it('is calling a session for an appeal with a session and no saved status', () => {
    expect(
      getInitialVerdictAppealStatus({
        verdictAppealStatus: null,
        courtSessions: [session],
      }),
    ).toBe(VerdictAppealStatus.COURT_SESSION_SCHEDULED)
  })

  it.each([undefined, null, {}, { courtSessions: [] }])(
    'is none when nothing is saved and nothing is booked: %j',
    (verdictAppealCase) => {
      expect(getInitialVerdictAppealStatus(verdictAppealCase)).toBeUndefined()
    },
  )
})

describe('withRulingDocumentChanged', () => {
  const caseWithAppealIn = (appealState: AppealCaseState) =>
    ({
      id: 'case-id',
      verdictAppealCase: {
        id: 'verdict-appeal',
        appealType: AppealCaseType.VERDICT,
        appealState,
        appealConclusion: 'Hinn áfrýjaði dómur skal vera óraskaður.',
      },
    } as unknown as WorkingCase)

  it('takes a confirmed appeal back and keeps everything else', () => {
    const confirmed = caseWithAppealIn(AppealCaseState.READY_TO_COMPLETE)

    expect(withRulingDocumentChanged(confirmed, true)).toEqual({
      ...confirmed,
      verdictAppealCase: {
        ...confirmed.verdictAppealCase,
        appealState: AppealCaseState.APPEALED,
      },
    })
  })

  it('leaves a confirmed appeal confirmed when the operation failed', () => {
    const confirmed = caseWithAppealIn(AppealCaseState.READY_TO_COMPLETE)

    expect(withRulingDocumentChanged(confirmed, false)).toBe(confirmed)
  })

  it.each([
    AppealCaseState.APPEALED,
    AppealCaseState.COMPLETED,
    AppealCaseState.WITHDRAWN,
  ])('leaves an appeal that is %s as it is', (appealState) => {
    const theCase = caseWithAppealIn(appealState)

    expect(withRulingDocumentChanged(theCase, true)).toBe(theCase)
  })

  it('leaves a case without a verdict appeal as it is', () => {
    const theCase = { id: 'case-id' } as unknown as WorkingCase

    expect(withRulingDocumentChanged(theCase, true)).toBe(theCase)
  })
})
