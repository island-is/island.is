import { getMessagingWindowInfo } from './messagingWindow'

const setClock = (utcIso: string) => jest.setSystemTime(new Date(utcIso))

describe('getMessagingWindowInfo', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  const window = { windowOpen: '08:00:00', windowClose: '22:00:00' }

  it('formats window times and current time as HH:mm labels', () => {
    setClock('2026-07-13T09:05:00Z')
    const info = getMessagingWindowInfo(window)
    expect(info.windowOpenLabel).toBe('08:00')
    expect(info.windowCloseLabel).toBe('22:00')
    expect(info.currentTimeLabel).toBe('09:05')
  })

  it('is not closing soon in the middle of the window', () => {
    setClock('2026-07-13T12:00:00Z')
    expect(getMessagingWindowInfo(window).isClosingSoon).toBe(false)
  })

  it('is closing soon within 30 minutes of closing', () => {
    setClock('2026-07-13T21:45:00Z')
    expect(getMessagingWindowInfo(window).isClosingSoon).toBe(true)
  })

  it('is closing soon exactly 30 minutes before closing', () => {
    setClock('2026-07-13T21:30:00Z')
    expect(getMessagingWindowInfo(window).isClosingSoon).toBe(true)
  })

  it('is not closing soon at exactly closing time', () => {
    setClock('2026-07-13T22:00:00Z')
    expect(getMessagingWindowInfo(window).isClosingSoon).toBe(false)
  })

  it('is not closing soon after closing time', () => {
    setClock('2026-07-13T22:10:00Z')
    expect(getMessagingWindowInfo(window).isClosingSoon).toBe(false)
  })

  it('handles a window that closes just after midnight', () => {
    setClock('2026-07-13T23:50:00Z')
    const info = getMessagingWindowInfo({
      windowOpen: '08:00:00',
      windowClose: '00:15:00',
    })
    expect(info.isClosingSoon).toBe(true)
  })

  it('returns undefined labels for unparseable times', () => {
    setClock('2026-07-13T21:45:00Z')
    const info = getMessagingWindowInfo({
      windowOpen: 'test',
      windowClose: 'test',
    })
    expect(info.windowOpenLabel).toBeUndefined()
    expect(info.windowCloseLabel).toBeUndefined()
    expect(info.isClosingSoon).toBe(false)
    expect(info.currentTimeLabel).toBe('21:45')
  })

  it('returns undefined labels when times are missing', () => {
    setClock('2026-07-13T21:45:00Z')
    const info = getMessagingWindowInfo({})
    expect(info.windowOpenLabel).toBeUndefined()
    expect(info.windowCloseLabel).toBeUndefined()
    expect(info.isClosingSoon).toBe(false)
  })
})
