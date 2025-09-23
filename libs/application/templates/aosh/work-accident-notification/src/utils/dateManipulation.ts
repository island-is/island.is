import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

export const getMaxDate = (application: Application) => {
  const date =
    getValueViaPath<string>(application.answers, 'accident.date') ?? ''
  const time =
    getValueViaPath<string>(application.answers, 'accident.time') ?? '00:00'

  // Add 1 day if time is before noon, else add 2 days
  // time.slice(0,2) -> hour part of "HH:MM"
  const maxDate = new Date(date)
  maxDate.setDate(
    maxDate.getDate() + (parseInt(time.slice(0, 2), 10) < 12 ? 1 : 2),
  )

  return maxDate
}

export const getMinDate = (application: Application) => {
  const date =
    getValueViaPath<string>(application.answers, 'accident.date') ?? ''
  const time =
    getValueViaPath<string>(application.answers, 'accident.time') ?? '00:00'
  const minDate = new Date(date)

  // Subtract 2 days if time is before noon, else subtract 1 day
  // time.slice(0,2) -> hour part of "HH:MM"
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

  const windowMs = 36 * 60 * 60 * 1000 // 36 hours in ms

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

  const diff = Math.abs(
    employeeDateAndTime.getTime() - accidentDateAndTime.getTime(),
  )

  return diff <= windowMs
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
