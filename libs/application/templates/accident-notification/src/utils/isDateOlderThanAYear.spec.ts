import { FormValue } from '@island.is/application/core'
import { isDateOlderThanAYear } from './isDateOlderThanAYear'
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
