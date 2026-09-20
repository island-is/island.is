import {
  formatTimeLabel,
  getNextOpeningInfo,
  getOpeningHoursLabels,
  isClosingSoon,
} from './messagingWindow'

const at = (windowOpen: string, windowClose: string, isAllDay = false) => ({
  windowOpen,
  windowClose,
  isAllDay,
})

describe('formatTimeLabel', () => {
  it('shortens HH:mm:ss to HH:mm and pads the hour', () => {
    expect(formatTimeLabel('06:00:00')).toBe('06:00')
    expect(formatTimeLabel('6:05')).toBe('06:05')
  })

  it('is undefined for a missing or unparseable time', () => {
    expect(formatTimeLabel(undefined)).toBeUndefined()
    expect(formatTimeLabel(null)).toBeUndefined()
    expect(formatTimeLabel('soon')).toBeUndefined()
  })
})

describe('isClosingSoon', () => {
  const closesAt = '2026-07-13T22:00:00.000Z'

  it('is true within 30 minutes of closing', () => {
    expect(isClosingSoon(closesAt, new Date('2026-07-13T21:45:00Z'))).toBe(true)
  })

  it('is true exactly 30 minutes before closing', () => {
    expect(isClosingSoon(closesAt, new Date('2026-07-13T21:30:00Z'))).toBe(true)
  })

  it('is false earlier than that', () => {
    expect(isClosingSoon(closesAt, new Date('2026-07-13T21:29:00Z'))).toBe(
      false,
    )
  })

  it('is false at and after closing time', () => {
    expect(isClosingSoon(closesAt, new Date('2026-07-13T22:00:00Z'))).toBe(
      false,
    )
    expect(isClosingSoon(closesAt, new Date('2026-07-13T22:10:00Z'))).toBe(
      false,
    )
  })

  it('handles a close time past midnight', () => {
    expect(
      isClosingSoon(
        '2026-07-14T00:10:00.000Z',
        new Date('2026-07-13T23:50:00Z'),
      ),
    ).toBe(true)
  })

  it('is false without a closing time', () => {
    expect(isClosingSoon(undefined)).toBe(false)
    expect(isClosingSoon(null)).toBe(false)
  })
})

describe('getOpeningHoursLabels', () => {
  it('formats each day type and leaves closed ones undefined', () => {
    const labels = getOpeningHoursLabels({
      weekday: at('06:00:00', '22:00:00'),
      weekend: at('00:00:00', '23:59:59', true),
      holiday: null,
    })
    expect(labels).toEqual({
      weekday: { openLabel: '06:00', closeLabel: '22:00', isAllDay: false },
      weekend: { openLabel: '00:00', closeLabel: '23:59', isAllDay: true },
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
    const info = getNextOpeningInfo(
      nextOpensAt,
      new Date('2026-07-13T23:14:00Z'),
    )
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
    expect(info?.dateLabel).toBe('18.07.2026')
  })

  it('formats the date label from the UTC calendar day', () => {
    const info = getNextOpeningInfo(
      { ...nextOpensAt, date: '2026-08-01T00:30:00.000Z' },
      new Date('2026-07-13T23:14:00Z'),
    )
    expect(info?.dateLabel).toBe('01.08.2026')
  })

  it('is undefined without a next opening', () => {
    expect(getNextOpeningInfo(undefined)).toBeUndefined()
    expect(getNextOpeningInfo(null)).toBeUndefined()
  })
})
