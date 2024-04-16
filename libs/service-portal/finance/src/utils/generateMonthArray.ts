import { displayMonthOrYear } from '@island.is/service-portal/core'
import capitalize from 'lodash/capitalize'

// generateYearMonthArray for housing benefit Select
function generateYearMonthArray(
  lang?: 'is' | 'en',
): { label: string; value: string }[] {
  const startDate = new Date(2017, 0) // Starting year for housing benefit service
  const currentDate = new Date()

  const yearMonthArray: string[] = []
  const currentDateIterator = new Date(startDate)

  while (currentDateIterator <= currentDate) {
    const year = currentDateIterator.getFullYear()
    const month = ('0' + (currentDateIterator.getMonth() + 1)).slice(-2)
    const yearMonth = `${year}-${month}`

    if (currentDateIterator.getMonth() === 0) {
      yearMonthArray.push(year.toString())
    }
    yearMonthArray.push(yearMonth)

    currentDateIterator.setMonth(currentDateIterator.getMonth() + 1)
  }

  return yearMonthArray.map((item) => ({
    label: capitalize(displayMonthOrYear(item, lang ?? 'is')),
    value: item,
  }))
}

export default generateYearMonthArray
