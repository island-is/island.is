import { FormValue } from '@island.is/application/types'
import { getYesterday } from '@island.is/shared/utils'
import { isDateOlderThanAYear } from './isDateOlderThanAYear'
describe('isDateOlderThanAYear', () => {
  const today = new Date()
  const yesterday = getYesterday(today)

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
