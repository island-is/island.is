import { getHolidays, Holiday } from 'fridagar'
import addDays from 'date-fns/addDays'
import isSameDay from 'date-fns/isSameDay'
import {
  NotificationConfig,
  NotificationType,
} from '@island.is/application/types'

export const isWorkday = (date: Date, holidays: Holiday[]): boolean => {
  const wDay = date.getDay()
  if (wDay === 0 || wDay === 6) {
    return false
  }
  return !holidays.some((holiday) => isSameDay(holiday.date, date))
}

export const addWorkDays = (date: Date, days: number) => {
  let result = new Date(date)
  let currentYear = result.getFullYear()
  let holidays = getHolidays(currentYear)

  while (days > 0) {
    result = addDays(result, 1)
    if (result.getFullYear() !== currentYear) {
      currentYear = result.getFullYear()
      holidays = getHolidays(currentYear)
    }
    if (isWorkday(result, holidays)) {
      days--
    }
  }
  return result
}

export const createDailyCompletionNotifications = (
  applicationLink: string,
  startDate: Date,
  endDate: Date,
) => {
  const notifications = []

  for (let date = startDate; date <= endDate; date = addDays(date, 1)) {
    notifications.push({
      template:
        NotificationConfig[NotificationType.ApplicationCompletionReminder]
          .templateId,
      schedule_time: date,
      args: [{ key: 'applicationLink', value: applicationLink }],
    })
  }
  return notifications
}
