import {
  getClosingSoonInfo,
  getNextOpeningInfo,
  getOpeningHoursLabels,
  getTodaysWindow,
} from './messagingWindow'

const at = (windowOpen: string, windowClose: string) => ({
  windowOpen,
  windowClose,
})

describe('getTodaysWindow', () => {
  const openingHours = {
    weekday: at('06:00:00', '22:00:00'),
    weekend: at('08:00:00', '20:00:00'),
    holiday: null,
  }

  it('resolves the window through dayType', () => {
    expect(getTodaysWindow({ dayType: 'WEEKDAY', openingHours })).toEqual(
      at('06:00:00', '22:00:00'),
    )
    expect(getTodaysWindow({ dayType: 'WEEKEND', openingHours })).toEqual(
      at('08:00:00', '20:00:00'),
    )
  })

  it('is undefined when the recipient is closed on this kind of day', () => {
    expect(
      getTodaysWindow({ dayType: 'HOLIDAY', openingHours }),
    ).toBeUndefined()
  })

  it('is undefined without opening hours or with an unknown day type', () => {
    expect(
      getTodaysWindow({ dayType: 'WEEKDAY', openingHours: null }),
    ).toBeUndefined()
    expect(getTodaysWindow({ dayType: 'SOMEDAY', openingHours })).toBeUndefined()
  })
})

describe('getClosingSoonInfo', () => {
  const window = at('08:00:00', '22:00:00')

  it('formats window times as HH:mm labels', () => {
    const info = getClosingSoonInfo(window, new Date('2026-07-13T09:05:00Z'))
    expect(info.openLabel).toBe('08:00')
    expect(info.closeLabel).toBe('22:00')
  })

  it('is closing soon within 30 minutes of closing', () => {
    expect(
      getClosingSoonInfo(window, new Date('2026-07-13T21:45:00Z'))
        .isClosingSoon,
    ).toBe(true)
  })

  it('is closing soon exactly 30 minutes before closing', () => {
    expect(
      getClosingSoonInfo(window, new Date('2026-07-13T21:30:00Z'))
        .isClosingSoon,
    ).toBe(true)
  })

  it('is not closing soon at exactly closing time', () => {
    expect(
      getClosingSoonInfo(window, new Date('2026-07-13T22:00:00Z'))
        .isClosingSoon,
    ).toBe(false)
  })

  it('is not closing soon after closing time', () => {
    expect(
      getClosingSoonInfo(window, new Date('2026-07-13T22:10:00Z'))
        .isClosingSoon,
    ).toBe(false)
  })

  it('handles a window that closes just after midnight', () => {
    const info = getClosingSoonInfo(
      at('08:00:00', '00:15:00'),
      new Date('2026-07-13T23:50:00Z'),
    )
    expect(info.isClosingSoon).toBe(true)
  })

  it('returns undefined labels for unparseable times', () => {
    const info = getClosingSoonInfo(
      at('test', 'test'),
      new Date('2026-07-13T21:45:00Z'),
    )
    expect(info.openLabel).toBeUndefined()
    expect(info.closeLabel).toBeUndefined()
    expect(info.isClosingSoon).toBe(false)
  })

  it('is never closing soon without a window', () => {
    const info = getClosingSoonInfo(undefined, new Date('2026-07-13T21:45:00Z'))
    expect(info.isClosingSoon).toBe(false)
    expect(info.openLabel).toBeUndefined()
  })
})

describe('getOpeningHoursLabels', () => {
  it('formats each day type and leaves closed ones undefined', () => {
    const labels = getOpeningHoursLabels({
      weekday: at('06:00:00', '22:00:00'),
      weekend: at('08:00:00', '20:00:00'),
      holiday: null,
    })
    expect(labels).toEqual({
      weekday: { openLabel: '06:00', closeLabel: '22:00' },
      weekend: { openLabel: '08:00', closeLabel: '20:00' },
      holiday: undefined,
    })
  })

  it('is undefined when the recipient never opens', () => {
    expect(getOpeningHoursLabels({})).toBeUndefined()
    expect(getOpeningHoursLabels(null)).toBeUndefined()
  })
})

describe('getNextOpeningInfo', () => {
  const nextOpensAt = {
    date: '2026-07-14T06:00:00.000Z',
    windowOpen: '06:00:00',
  }

  it('says tomorrow when the next opening is the next UTC day', () => {
    const info = getNextOpeningInfo(nextOpensAt, new Date('2026-07-13T23:14:00Z'))
    expect(info).toMatchObject({ when: 'tomorrow', timeLabel: '06:00' })
  })

  it('says today when the next opening is later the same UTC day', () => {
    const info = getNextOpeningInfo(
      { ...nextOpensAt, date: '2026-07-13T06:00:00.000Z' },
      new Date('2026-07-13T04:00:00Z'),
    )
    expect(info?.when).toBe('today')
  })

  it('says later when the next opening is beyond tomorrow', () => {
    const info = getNextOpeningInfo(
      { ...nextOpensAt, date: '2026-07-18T06:00:00.000Z' },
      new Date('2026-07-13T23:14:00Z'),
    )
    expect(info?.when).toBe('later')
  })

  it('is undefined without a next opening', () => {
    expect(getNextOpeningInfo(undefined)).toBeUndefined()
    expect(getNextOpeningInfo(null)).toBeUndefined()
  })
})
