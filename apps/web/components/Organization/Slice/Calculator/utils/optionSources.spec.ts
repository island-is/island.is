import { yearOptions } from './optionSources'

describe('yearOptions', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2026-06-01'))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('offers the contract year range, newest first', () => {
    const options = yearOptions(2019, 2026)

    expect(options).toHaveLength(8)
    expect(options[0].value).toBe('2026')
    expect(options[options.length - 1].value).toBe('2019')
  })

  it('falls back when the contract range is inverted', () => {
    const options = yearOptions(2026, 2019)

    expect(options[0].value).toBe('2026')
    expect(options[options.length - 1].value).toBe('2004')
  })

  it('falls back to the window ending in the current year when the range is unbounded', () => {
    const options = yearOptions(0, 2147483647)

    expect(options[0].value).toBe('2026')
    expect(options[options.length - 1].value).toBe('2004')
  })

  it('falls back to the window ending in the current year without bounds', () => {
    const options = yearOptions()

    expect(options[0].value).toBe('2026')
    expect(options[options.length - 1].value).toBe('2004')
  })
})
