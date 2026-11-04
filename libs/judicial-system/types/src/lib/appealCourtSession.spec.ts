import { AppealCaseState } from './appealCase'
import {
  getScheduledAppealCourtSessions,
  getUpcomingAppealCourtSessions,
  sortAppealCourtSessionsByDate,
} from './appealCourtSession'

describe('sortAppealCourtSessionsByDate', () => {
  it('orders every dated session, earliest first, past ones included', () => {
    const later = { id: 'later', sessionDate: new Date(2026, 3, 20) }
    const held = { id: 'held', sessionDate: '2025-01-05T10:00:00.000Z' }
    const sooner = { id: 'sooner', sessionDate: new Date(2026, 2, 25) }

    expect(sortAppealCourtSessionsByDate([later, held, sooner])).toEqual([
      held,
      sooner,
      later,
    ])
  })

  it('leaves out a session without a usable date', () => {
    const dated = { id: 'dated', sessionDate: new Date(2026, 2, 25) }

    expect(
      sortAppealCourtSessionsByDate([
        { id: 'none', sessionDate: null },
        { id: 'bad', sessionDate: 'not a date' },
        dated,
      ]),
    ).toEqual([dated])
    expect(sortAppealCourtSessionsByDate(undefined)).toEqual([])
  })
})

describe('getUpcomingAppealCourtSessions', () => {
  // A fixed clock, so the fixtures mean the same whenever this runs.
  const now = new Date(2026, 2, 10, 14, 0)

  const at = (
    year: number,
    month: number,
    day: number,
    hours = 10,
    minutes = 0,
  ) => new Date(year, month - 1, day, hours, minutes)

  it('orders the sessions ahead by date, earliest first', () => {
    const later = { id: 'later', sessionDate: at(2026, 4, 20) }
    const sooner = { id: 'sooner', sessionDate: at(2026, 3, 25) }

    expect(getUpcomingAppealCourtSessions([later, sooner], now)).toEqual([
      sooner,
      later,
    ])
  })

  it('leaves out a session whose day has passed', () => {
    const yesterday = { id: 'yesterday', sessionDate: at(2026, 3, 9, 23, 59) }
    const ahead = { id: 'ahead', sessionDate: at(2026, 3, 11) }

    expect(getUpcomingAppealCourtSessions([yesterday, ahead], now)).toEqual([
      ahead,
    ])
  })

  it('keeps a session on the agenda through its day', () => {
    const thisMorning = { id: 'morning', sessionDate: at(2026, 3, 10, 9, 0) }

    expect(getUpcomingAppealCourtSessions([thisMorning], now)).toEqual([
      thisMorning,
    ])
  })

  it('reads a date given as a string', () => {
    const session = { id: 's', sessionDate: '2026-03-12T10:00:00.000Z' }

    expect(getUpcomingAppealCourtSessions([session], now)).toEqual([session])
  })

  it('leaves out a session without a usable date', () => {
    expect(
      getUpcomingAppealCourtSessions(
        [
          { id: 'none', sessionDate: null },
          { id: 'bad', sessionDate: 'not a date' },
          { id: 'missing' },
        ],
        now,
      ),
    ).toEqual([])
  })

  it('reads nothing from no sessions', () => {
    expect(getUpcomingAppealCourtSessions(undefined, now)).toEqual([])
    expect(getUpcomingAppealCourtSessions(null, now)).toEqual([])
  })
})

describe('getScheduledAppealCourtSessions', () => {
  const now = new Date(2026, 2, 10, 14, 0)
  const ahead = { id: 'ahead', sessionDate: new Date(2026, 3, 2, 13, 0) }
  const held = { id: 'held', sessionDate: new Date(2026, 2, 9, 13, 0) }

  it('has the sessions ahead on the agenda while the appeal is open', () => {
    expect(
      getScheduledAppealCourtSessions(
        { appealState: AppealCaseState.RECEIVED, courtSessions: [held, ahead] },
        now,
      ),
    ).toEqual([ahead])
  })

  it.each([AppealCaseState.COMPLETED, AppealCaseState.WITHDRAWN])(
    'has nothing on the agenda once the appeal is %s',
    (appealState) => {
      expect(
        getScheduledAppealCourtSessions(
          { appealState, courtSessions: [ahead] },
          now,
        ),
      ).toEqual([])
    },
  )

  it('has nothing on the agenda without an appeal', () => {
    expect(getScheduledAppealCourtSessions(undefined, now)).toEqual([])
    expect(getScheduledAppealCourtSessions(null, now)).toEqual([])
  })
})
