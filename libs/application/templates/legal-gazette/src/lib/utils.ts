import { getValueViaPath } from '@island.is/application/core'
import { ApplicationContext } from '@island.is/application/types'

export const isWeekday = (date: Date) => {
  const day = date.getDay()
  return day !== 0 && day !== 6
}

export const getWeekendDates = (startDate: Date, endDate: Date) => {
  const weekendDates: Date[] = []
  const currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    if (!isWeekday(currentDate)) {
      weekendDates.push(new Date(currentDate))
    }
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return weekendDates
}

export const didSubmitSuccessfully = (context: ApplicationContext) => {
  const success = getValueViaPath(
    context.application.externalData,
    'successfullyPosted.data.success',
  )

  return success === true
}
