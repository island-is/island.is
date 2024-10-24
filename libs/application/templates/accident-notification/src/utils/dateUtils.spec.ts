import { FormValue } from '@island.is/application/types'
import { isDateOlderThanAYear, isValid24HFormatTime } from './dateUtils'

describe('isDateOlderThanAYear', () => {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)

  const twoYearsAgo = new Date()
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2)

  const dateIsOlderTwoYearsAgo: FormValue = {
    accidentDetails: { dateOfAccident: twoYearsAgo.toString() },
  }

  const dateIsYesterday: FormValue = {
    accidentDetails: { dateOfAccident: yesterday.toString() },
  }

  const emptyObject = {}

  it('should return true for date from two years ago', () => {
    expect(isDateOlderThanAYear(dateIsOlderTwoYearsAgo)).toEqual(true)
  })
  it(`should return false for yesterday's date`, () => {
    expect(isDateOlderThanAYear(dateIsYesterday)).toEqual(false)
  })
  it('should return false for empty object', () => {
    expect(isDateOlderThanAYear(emptyObject)).toEqual(false)
  })
})

describe('isValid24HFormatTime', () => {
  it.each(['0000', '2359', '1234'])(
    'should return true for valid time',
    (time) => {
      const result = isValid24HFormatTime(time)
      expect(result).toBeTruthy()
    },
  )

  it.each([
    '2534',
    '1265',
    '2360',
    '2400',
    '12:34',
    '',
    '1',
    '12',
    '123',
    '12345',
  ])('should return false for invalid time', (time) => {
    const result = isValid24HFormatTime(time)
    expect(result).toBeFalsy()
  })
})
