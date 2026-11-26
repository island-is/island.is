import { dataSchema } from './dataSchema'

const disabilityPeriodSchema = dataSchema.shape.disabilityPeriod

describe('disabilityPeriod schema', () => {
  beforeAll(() => {
    jest.useFakeTimers()
    // November 2026 -> valid range is Nov 2024 – Oct 2026
    jest.setSystemTime(new Date(2026, 10, 23))
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('accepts a month within the allowed window', () => {
    expect(
      disabilityPeriodSchema.safeParse({ year: '2026', month: '0' }).success,
    ).toBe(true)
    expect(
      disabilityPeriodSchema.safeParse({ year: '2024', month: '11' }).success,
    ).toBe(true)
  })

  it.each([null, '', undefined])('rejects month = %p', (month) => {
    expect(
      disabilityPeriodSchema.safeParse({ year: '2026', month }).success,
    ).toBe(false)
  })

  it('rejects a month that is not offered for the chosen year', () => {
    // December 2026 is in the future
    expect(
      disabilityPeriodSchema.safeParse({ year: '2026', month: '11' }).success,
    ).toBe(false)
    // October 2024 is older than 24 months
    expect(
      disabilityPeriodSchema.safeParse({ year: '2024', month: '9' }).success,
    ).toBe(false)
  })

  it('rejects an empty year', () => {
    expect(
      disabilityPeriodSchema.safeParse({ year: null, month: '3' }).success,
    ).toBe(false)
  })
})
