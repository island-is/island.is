import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { MAX_DAYS_FALLBACK } from './constants'

export const dateToMaxDate = (application: Application) => {
  const fromDate = getValueViaPath<string>(application.answers, 'date.from')
  if (!fromDate) {
    return undefined
  }
  const maxDateTo = getValueViaPath<string>(
    application.externalData,
    'eligibilityData.data.maxDateTo',
  )
  const maxDaysRaw =
    getValueViaPath<string>(
      application.externalData,
      'eligibilityData.data.maxDaysPerRequest',
    ) || MAX_DAYS_FALLBACK.toString()
  const maxDays = parseInt(maxDaysRaw, 10) || MAX_DAYS_FALLBACK

  const date = new Date(fromDate)
  date.setDate(date.getDate() + maxDays - 1)

  if (maxDateTo && date > new Date(maxDateTo)) {
    return new Date(maxDateTo)
  }
  return date
}
