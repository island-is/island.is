import {
  getConnectedRange,
  getDateConnections,
  getDateRanges,
  getDatesBetween,
} from './utils'

describe('AnnualMultiRangeCalendar utils', () => {
  it('returns an inclusive range in chronological order', () => {
    expect(getDatesBetween('2026-08-03', '2026-07-31')).toEqual([
      '2026-07-31',
      '2026-08-01',
      '2026-08-02',
      '2026-08-03',
    ])
  })

  it('groups consecutive selected dates into ranges', () => {
    expect(
      getDateRanges([
        '2026-08-11',
        '2026-08-01',
        '2026-08-02',
        '2026-08-10',
        '2026-08-10',
      ]),
    ).toEqual([
      { from: '2026-08-01', to: '2026-08-02' },
      { from: '2026-08-10', to: '2026-08-11' },
    ])
  })

  it('finds the complete contiguous range around a selected date', () => {
    expect(
      getConnectedRange('2026-08-02', [
        '2026-07-31',
        '2026-08-01',
        '2026-08-02',
        '2026-08-03',
        '2026-08-10',
      ]),
    ).toEqual(new Set(['2026-07-31', '2026-08-01', '2026-08-02', '2026-08-03']))
  })

  it('connects within a week and fades continuations between months', () => {
    const dates = new Set([
      '2026-07-30',
      '2026-07-31',
      '2026-08-01',
      '2026-08-02',
      '2026-08-03',
    ])

    expect(getDateConnections('2026-07-31', dates)).toEqual({
      connectsLeft: true,
      connectsRight: false,
      continuesFromPreviousMonth: false,
      continuesIntoNextMonth: true,
    })
    expect(getDateConnections('2026-08-01', dates)).toEqual({
      connectsLeft: false,
      connectsRight: true,
      continuesFromPreviousMonth: true,
      continuesIntoNextMonth: false,
    })
    expect(getDateConnections('2026-08-03', dates).connectsLeft).toBe(false)
  })
})
