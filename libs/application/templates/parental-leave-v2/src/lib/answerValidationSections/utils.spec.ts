import parseISO from 'date-fns/parseISO'
import { Period } from '../../types'
import { dateIsWithinOtherPeriods } from './utils'

const period = (
  startDate: string,
  endDate: string,
  rawIndex: number,
): Period => ({ startDate, endDate, ratio: '100', rawIndex })

describe('dateIsWithinOtherPeriods', () => {
  const periods = [
    period('2021-01-15', '2021-02-14', 0),
    period('2021-04-01', '2021-04-30', 1),
    period('2021-06-01', '2021-06-30', 2),
  ]

  it('detects a date within a later period that is outside the first one', () => {
    expect(dateIsWithinOtherPeriods(parseISO('2021-04-10'), periods)).toBe(true)
    expect(dateIsWithinOtherPeriods(parseISO('2021-06-30'), periods)).toBe(true)
  })

  it('returns false for a date outside every period', () => {
    expect(dateIsWithinOtherPeriods(parseISO('2021-03-01'), periods)).toBe(
      false,
    )
    expect(dateIsWithinOtherPeriods(parseISO('2021-07-01'), periods)).toBe(
      false,
    )
  })

  it('ignores the period being validated', () => {
    expect(dateIsWithinOtherPeriods(parseISO('2021-04-10'), periods, 1)).toBe(
      false,
    )
    expect(dateIsWithinOtherPeriods(parseISO('2021-06-10'), periods, 1)).toBe(
      true,
    )
  })

  it('keeps checking past incomplete or invalid periods', () => {
    const withGaps = [
      period('2021-01-15', '', 0),
      period('2021-03-31', '2021-03-01', 1),
      period('not-a-date', '2021-03-01', 2),
      period('2021-04-01', '2021-04-30', 3),
    ]

    expect(dateIsWithinOtherPeriods(parseISO('2021-04-10'), withGaps)).toBe(
      true,
    )
    expect(dateIsWithinOtherPeriods(parseISO('2021-03-15'), withGaps)).toBe(
      false,
    )
  })
})
