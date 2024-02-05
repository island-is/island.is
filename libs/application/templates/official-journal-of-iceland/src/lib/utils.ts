import addDays from 'date-fns/addDays'
import addYears from 'date-fns/addYears'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { TypeIds, emailRegex } from './constants'
import { getValueViaPath } from '@island.is/application/core'
import { ApplicationContext } from '@island.is/application/types'

const isWeekday = (date: Date) => {
  const day = date.getDay()
  return day !== 0 && day !== 6
}

export const getWeekendDates = (
  startDate = new Date(),
  endDate = addYears(new Date(), 1),
) => {
  const weekdays = []
  let currentDay = startDate
  while (currentDay <= endDate) {
    if (!isWeekday(currentDay)) {
      weekdays.push(currentDay)
    }
    currentDay = addDays(currentDay, 1)
  }
  return weekdays
}

export const getWeekdayDates = (
  startDate = new Date(),
  endDate = addYears(new Date(), 1),
) => {
  const weekends = []
  let currentDay = startDate
  while (currentDay <= endDate) {
    if (isWeekday(currentDay)) {
      weekends.push(currentDay)
    }
    currentDay = addDays(currentDay, 1)
  }
  return weekends
}

export const getNextAvailableDate = (date: Date): Date => {
  if (isWeekday(date)) {
    return date
  }
  return getNextAvailableDate(addDays(date, 1))
}

export const isValidEmail = (email: string) => {
  return emailRegex.test(email)
}

export const isValidPhone = (phone: string) => {
  return parsePhoneNumberFromString(phone, 'IS')?.isValid() ?? false
}

export const mapDepartmentToId = (department?: string) => {
  if (!department) return ''
  const s = department.toLowerCase()
  switch (s) {
    case 'a-deild':
      return '0'
    case 'b-deild':
      return '1'
    case 'c-deild':
      return '2'
    default:
      return ''
  }
}

export const mapDepartmentEnumToDepartment = (department?: string) => {
  if (!department) return ''
  switch (department) {
    case 'ADeild':
      return 'A deild'
    case 'BDeild':
      return 'B deild'
    case 'CDeild':
      return 'C deild'
    default:
      return ''
  }
}

export const mapStatusEnumToStatus = (status?: string) => {
  if (!status) return ''
  switch (status) {
    case 'Active':
      return 'Virk'
    case 'Revoked':
      return 'Afturkölluð'
    case 'Draft':
      return 'Drög'
    case 'Old':
      return 'Eldri auglýsing'
    case 'Rejected':
      return 'Hafnað'
    case 'Waiting':
      return 'Í bið'
    case 'InProgress':
      return 'Í vinnslu'
    case 'Submitted':
      return 'Innsend'
    case 'ReadyForPublication':
      return 'Tilbúin til útgáfu'
    case 'Published':
      return 'Útgefin'
    default:
      return ''
  }
}

export const isApplicationValid = (applicationContext: ApplicationContext) => {
  const status = getValueViaPath(
    applicationContext.application.externalData,
    'validateApplication.data.type',
  )

  return status === 'success'
}

export const mapIdToType = (id?: TypeIds | string) => {
  if (!id) return ''
  switch (id) {
    case TypeIds.AUGLYSING:
      return 'Auglýsing'
    case TypeIds.GJALDSKRA:
      return 'Gjaldskrá'
    case TypeIds.REGLUGERDIR:
      return 'Reglugerðir'
    case TypeIds.SKIPULAGSSKRA:
      return 'Skipulagsskrá'
    default:
      return ''
  }
}
