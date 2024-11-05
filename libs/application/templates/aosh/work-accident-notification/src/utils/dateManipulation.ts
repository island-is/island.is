import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

export const getMaxDate = (application: Application) => {
  const date = getValueViaPath(
    application.answers,
    'accident.date',
    new Date().toString(),
  ) as string
  return new Date(date)
}

export const getMinDate = (application: Application) => {
  const date =
    getValueViaPath<string>(application.answers, 'accident.date') ?? ''
  const time =
    getValueViaPath<string>(application.answers, 'accident.time') ?? '00:00'
  const minDate = new Date(date)
  minDate.setDate(
    minDate.getDate() - (parseInt(time.slice(0, 2), 10) < 12 ? 2 : 1),
  )
  return minDate
}

export const getDateAndTime = (
  date: string,
  hours: string,
  minutes: string,
): Date => {
  const finalDate = new Date(date)
  finalDate.setHours(
    parseInt(hours, 10), // hours
    parseInt(minutes, 10), // minutes
  )
  return finalDate
}

export const dateIsWithin36Hours = (
  application: Application,
  date: string,
  time: string,
) => {
  const accidentDate =
    getValueViaPath<string>(application.answers, 'accident.date') ??
    new Date().toString()
  const accidentTime =
    getValueViaPath<string>(application.answers, 'accident.time') ?? '00:00'
  const timeAllowed = 1000 * 60 * 60 * 36
  const accidentDateAndTime = getDateAndTime(
    accidentDate,
    accidentTime.slice(0, 2),
    accidentTime.slice(2, 4),
  )
  const employeeDateAndTime = getDateAndTime(
    date,
    time.slice(0, 2),
    time.slice(2, 4),
  )

  return (
    accidentDateAndTime.getTime() >= employeeDateAndTime.getTime() &&
    accidentDateAndTime.getTime() - timeAllowed < employeeDateAndTime.getTime()
  )
}

export const isValid24HFormatTime = (value: string) => {
  if (value.length !== 4) return false
  const hours = parseInt(value.slice(0, 2))
  const minutes = parseInt(value.slice(2, 4))
  if (hours > 23) return false
  if (minutes > 59) return false
  return true
}

export const isValidPhoneNumber = (phoneNumber: string) => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone && phone.isValid()
}
