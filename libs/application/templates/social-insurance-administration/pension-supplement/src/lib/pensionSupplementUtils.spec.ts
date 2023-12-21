import addMonths from 'date-fns/addMonths'
import subYears from 'date-fns/subYears'
import { getAvailableYears, getAvailableMonths } from './pensionSupplementUtils'
import { MONTHS } from './constants'

describe('getAvailableYears', () => {
  it('should return available years', () => {
    const today = new Date()
    const startDateYear = subYears(
      today.setMonth(today.getMonth() + 1),
      2,
    ).getFullYear()
    const endDateYear = addMonths(new Date(), 6).getFullYear()
    const res = getAvailableYears()

    const expected = Array.from(
      Array(endDateYear - (startDateYear - 1)),
      (_, i) => {
        return {
          value: (i + startDateYear).toString(),
          label: (i + startDateYear).toString(),
        }
      },
    )

    expect(res).toEqual(expected)
  })
})

describe('getAvailableMonths', () => {
  it('should return available months for selected year, selected year same as start date', () => {
    const startDate = subYears(new Date(), 2)
    const endDate = addMonths(new Date(), 6)
    const selectedYear = startDate.getFullYear().toString()
    const res = getAvailableMonths(selectedYear)

    let months = MONTHS

    if (startDate.getFullYear().toString() === selectedYear) {
      months = months.slice(startDate.getMonth() + 1, months.length)
    } else if (endDate.getFullYear().toString() === selectedYear) {
      months = months.slice(0, endDate.getMonth() + 1)
    }

    expect(res).toEqual(months)
  })

  it('should return available months for selected year, selected year same as end date', () => {
    const startDate = subYears(new Date(), 2)
    const endDate = addMonths(new Date(), 6)
    const selectedYear = endDate.getFullYear().toString()
    const res = getAvailableMonths(selectedYear)

    let months = MONTHS

    if (startDate.getFullYear().toString() === selectedYear) {
      months = months.slice(startDate.getMonth(), months.length + 1)
    } else if (endDate.getFullYear().toString() === selectedYear) {
      months = months.slice(0, endDate.getMonth() + 1)
    }

    expect(res).toEqual(months)
  })

  it('should return available months for selected year, selected year is todays year', () => {
    const startDate = subYears(new Date(), 2)
    const endDate = addMonths(new Date(), 6)
    const selectedYear = new Date().getFullYear().toString()
    const res = getAvailableMonths(selectedYear)

    let months = MONTHS

    if (startDate.getFullYear().toString() === selectedYear) {
      months = months.slice(startDate.getMonth(), months.length + 1)
    } else if (endDate.getFullYear().toString() === selectedYear) {
      months = months.slice(0, endDate.getMonth() + 1)
    }

    expect(res).toEqual(months)
  })
})
