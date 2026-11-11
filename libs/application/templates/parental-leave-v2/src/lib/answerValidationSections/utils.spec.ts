import parseISO from 'date-fns/parseISO'
import { Period } from '../../types'
import {
  dateIsWithinOtherPeriods,
  findShortPeriodWithoutPredecessor,
  getShortPeriodWithoutPredecessorError,
} from './utils'
import { errorMessages } from '../messages'

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

describe('findShortPeriodWithoutPredecessor', () => {
  const long: Period = {
    startDate: '2030-01-01',
    endDate: '2030-03-31',
    ratio: '100',
  }
  const short: Period = {
    startDate: '2030-04-01',
    endDate: '2030-04-07',
    ratio: '100',
  }

  it('accepts a short period that starts the day after a longer one ends', () => {
    expect(findShortPeriodWithoutPredecessor([long, short])).toBeUndefined()
  })

  it('finds a short period whose preceding period was deleted', () => {
    const paid: Period = {
      startDate: '2029-12-01',
      endDate: '2029-12-31',
      ratio: '100',
      paid: true,
      approved: true,
    }

    expect(findShortPeriodWithoutPredecessor([paid, short])).toBe(short)
    expect(findShortPeriodWithoutPredecessor([short])).toBe(short)
  })

  it('finds a short period in the middle of the plan, not only the last one', () => {
    const later: Period = {
      startDate: '2030-06-01',
      endDate: '2030-07-31',
      ratio: '100',
    }

    expect(findShortPeriodWithoutPredecessor([short, later])).toBe(short)
  })

  it('checks the periods in date order', () => {
    expect(findShortPeriodWithoutPredecessor([short, long])).toBeUndefined()
  })

  it('accepts periods of the minimum length or longer', () => {
    expect(
      findShortPeriodWithoutPredecessor([
        { startDate: '2030-04-01', endDate: '2030-04-14', ratio: '100' },
      ]),
    ).toBeUndefined()
  })

  it('skips periods VMST has paid or approved, and periods already over', () => {
    expect(
      findShortPeriodWithoutPredecessor([{ ...short, approved: true }]),
    ).toBeUndefined()
    expect(
      findShortPeriodWithoutPredecessor([{ ...short, paid: true }]),
    ).toBeUndefined()
    expect(
      findShortPeriodWithoutPredecessor([
        { startDate: '2020-04-01', endDate: '2020-04-07', ratio: '100' },
      ]),
    ).toBeUndefined()
  })

  it('names the period by its position in the plan', () => {
    const paid: Period = {
      startDate: '2029-12-01',
      endDate: '2029-12-31',
      ratio: '100',
      paid: true,
    }

    expect(getShortPeriodWithoutPredecessorError([paid, short])).toEqual({
      ...errorMessages.periodsShortPeriodNotContinuous,
      values: {
        index: 2,
        startDate: '01.04.2030',
        endDate: '07.04.2030',
        minimumDays: 14,
      },
    })
    expect(getShortPeriodWithoutPredecessorError([long, short])).toBeUndefined()
  })
})
