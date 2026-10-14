import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import {
  AppealCourtSessionType,
  AppealEventType,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'

import type { AppealCourtSessionDraft } from './VerdictAppealStatus.logic'
import {
  formatAppealCourtSessionDetails,
  getVerdictAppealStatusHeaderLines,
  isAppealCourtSessionComplete,
  isAppealCourtSessionEmpty,
  sortAppealCourtSessionsNewestFirst,
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
})

describe('sortAppealCourtSessionsNewestFirst', () => {
  it('puts the most recently booked session first, whatever its date', () => {
    const sessions = [
      { id: 'early', created: '2026-10-01T10:00:00.000Z' },
      { id: 'latest', created: '2026-10-14T10:00:00.000Z' },
      { id: 'middle', created: '2026-10-07T10:00:00.000Z' },
    ]

    expect(
      sortAppealCourtSessionsNewestFirst(sessions).map((s) => s.id),
    ).toEqual(['latest', 'middle', 'early'])
    // The input is left as it was.
    expect(sessions.map((s) => s.id)).toEqual(['early', 'latest', 'middle'])
  })

  it('keeps sessions without a booking time where they were', () => {
    const sessions = [
      { id: 'a', created: undefined },
      { id: 'b', created: '2026-10-07T10:00:00.000Z' },
      { id: 'c', created: null },
    ]

    expect(
      sortAppealCourtSessionsNewestFirst(sessions).map((s) => s.id),
    ).toEqual(['b', 'a', 'c'])
  })
})
