import { isValidDate, toIcelandTime } from './date'

describe('isValidDate', () => {
  it('accepts a valid date', () => {
    expect(isValidDate(new Date('2024-05-17T10:30:00Z'))).toBe(true)
  })

  it('rejects an invalid date', () => {
    expect(isValidDate(new Date('not a date'))).toBe(false)
  })
})

describe('toIcelandTime', () => {
  const localParts = (date: Date) => ({
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hours: date.getHours(),
    minutes: date.getMinutes(),
  })

  it('exposes the Icelandic wall clock as local date parts', () => {
    expect(localParts(toIcelandTime(new Date('2024-05-17T10:30:00Z')))).toEqual(
      {
        year: 2024,
        month: 5,
        day: 17,
        hours: 10,
        minutes: 30,
      },
    )
  })

  it('does not apply daylight saving, since Iceland stays on UTC', () => {
    const winter = toIcelandTime(new Date('2024-01-15T23:45:00Z'))
    const summer = toIcelandTime(new Date('2024-07-15T23:45:00Z'))

    expect(localParts(winter).hours).toBe(23)
    expect(localParts(summer).hours).toBe(23)
  })

  it('rolls over to the next day when the instant does', () => {
    expect(localParts(toIcelandTime(new Date('2024-02-29T00:15:00Z')))).toEqual(
      {
        year: 2024,
        month: 2,
        day: 29,
        hours: 0,
        minutes: 15,
      },
    )
  })

  it('accepts date strings and timestamps', () => {
    const expected = localParts(toIcelandTime(new Date('2024-05-17T10:30:00Z')))

    expect(localParts(toIcelandTime('2024-05-17T10:30:00Z'))).toEqual(expected)
    expect(localParts(toIcelandTime(Date.UTC(2024, 4, 17, 10, 30)))).toEqual(
      expected,
    )
  })

  it('returns an invalid date untouched', () => {
    expect(isValidDate(toIcelandTime('not a date'))).toBe(false)
  })
})
