import { isRentalPeriodStartDateTooFarAhead } from './utils'

describe('isRentalPeriodStartDateTooFarAhead', () => {
  const now = new Date(2026, 9, 6, 13, 0)
  const startDate = (year: number, month: number, day: number) =>
    new Date(year, month, day).toISOString()

  it('allows a start date exactly one month ahead', () => {
    expect(
      isRentalPeriodStartDateTooFarAhead(startDate(2026, 10, 6), now),
    ).toBe(false)
  })

  it('rejects a start date more than one month ahead', () => {
    expect(
      isRentalPeriodStartDateTooFarAhead(startDate(2026, 10, 7), now),
    ).toBe(true)
    expect(isRentalPeriodStartDateTooFarAhead(startDate(2027, 0, 1), now)).toBe(
      true,
    )
  })

  it('allows past start dates', () => {
    expect(isRentalPeriodStartDateTooFarAhead(startDate(2025, 0, 1), now)).toBe(
      false,
    )
  })
})
