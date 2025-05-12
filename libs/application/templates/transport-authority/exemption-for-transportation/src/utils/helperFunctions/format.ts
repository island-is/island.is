import { parsePhoneNumberFromString } from 'libphonenumber-js'
import kennitala from 'kennitala'
import format from 'date-fns/format'

export const formatPhoneNumber = (phoneNumber: string | undefined): string => {
  if (!phoneNumber) return ''
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone?.formatNational() || phoneNumber
}

export const formatKennitala = (nationalId: string | undefined): string => {
  if (!nationalId) return ''
  return kennitala.format(nationalId)
}

export const formatDate = (date: Date): string =>
  date ? format(new Date(date), 'dd.MM.yyyy') : ''

export const formatDateStr = (dateStr: string | undefined): string =>
  dateStr ? formatDate(new Date(dateStr)) : ''

export const formatNumber = (num?: number) => num && num.toLocaleString('de-DE')
