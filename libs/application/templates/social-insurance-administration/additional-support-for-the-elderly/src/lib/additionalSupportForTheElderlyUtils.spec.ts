import addMonths from 'date-fns/addMonths'
import subMonths from 'date-fns/subMonths'

import { getAvailableYears } from './additionalSupportForTheElderlyUtils'

describe('getAvailableYears', () => {
  it('should return available years', () => {
    const today = new Date()
    const startDateYear = subMonths(new Date(), 3).getFullYear()
    const endDateYear = addMonths(today, 6).getFullYear()

    const res = getAvailableYears()
    const expected = Array.from(
      Array(endDateYear - startDateYear + 1).keys(),
    ).map((x) => {
      const theYear = x + startDateYear
      return { value: theYear.toString(), label: theYear.toString() }
    })

    expect(res).toEqual(expected)
  })
})
