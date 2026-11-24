import {
  addRange,
  findRangeToRemove,
  getDateConnections,
  getDatesBetween,
  toRange,
} from './utils'

describe('AnnualMultiRangeCalendar utils', () => {
  it('returns an inclusive range in chronological order', () => {
    expect(getDatesBetween('2026-08-03', '2026-07-31')).toEqual([
      '2026-07-31',
      '2026-08-01',
      '2026-08-02',
      '2026-08-03',
    ])
    expect(toRange('2026-08-03', '2026-07-31')).toEqual({
      from: '2026-07-31',
      to: '2026-08-03',
    })
  })

  it('keeps ranges that are next to or touching each other apart', () => {
    const first = { from: '2026-07-01', to: '2026-07-03' }

    expect(addRange([first], { from: '2026-07-04', to: '2026-07-06' })).toEqual(
      [first, { from: '2026-07-04', to: '2026-07-06' }],
    )
    expect(addRange([first], { from: '2026-07-03', to: '2026-07-06' })).toEqual(
      [first, { from: '2026-07-03', to: '2026-07-06' }],
    )
  })

  it('merges a new range with every range it overlaps and sorts them', () => {
    expect(
      addRange(
        [
          { from: '2026-07-20', to: '2026-07-22' },
          { from: '2026-07-01', to: '2026-07-03' },
          { from: '2026-07-05', to: '2026-07-08' },
        ],
        { from: '2026-07-02', to: '2026-07-06' },
      ),
    ).toEqual([
      { from: '2026-07-01', to: '2026-07-08' },
      { from: '2026-07-20', to: '2026-07-22' },
    ])
  })

  it('removes the range a day is inside of, but not the range it ends', () => {
    const first = { from: '2026-07-01', to: '2026-07-03' }
    const second = { from: '2026-07-03', to: '2026-07-06' }

    expect(findRangeToRemove([first, second], '2026-07-02')).toBe(first)
    expect(findRangeToRemove([first, second], '2026-07-03')).toBe(second)
    expect(findRangeToRemove([first], '2026-07-03')).toBeUndefined()
  })

  it('connects within a week and fades continuations between months', () => {
    const range = { from: '2026-07-30', to: '2026-08-03' }
    const isJoined = (first: string, second: string) =>
      [first, second].every((date) => range.from <= date && date <= range.to)

    expect(getDateConnections('2026-07-31', isJoined)).toEqual({
      connectsLeft: true,
      connectsRight: false,
      continuesFromPreviousMonth: false,
      continuesIntoNextMonth: true,
    })
    expect(getDateConnections('2026-08-01', isJoined)).toEqual({
      connectsLeft: false,
      connectsRight: true,
      continuesFromPreviousMonth: true,
      continuesIntoNextMonth: false,
    })
    expect(getDateConnections('2026-08-03', isJoined).connectsLeft).toBe(false)
  })
})
