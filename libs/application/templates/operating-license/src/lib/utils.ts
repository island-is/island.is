import {
  APPLICATION_TYPES,
  Operation,
  OPERATION_CATEGORY,
  YES,
} from './constants'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

export const hasYes = (answer: any) => {
  if (Array.isArray(answer)) {
    return answer.includes(YES)
  }
  if (answer instanceof Object) {
    return Object.values(answer).includes(YES)
  }
  return answer === YES
}

export const isValid24HFormatTime = (value: string) => {
  if (value.length !== 4) {
    return false
  }
  const hours = parseInt(value.slice(0, 2))
  const minutes = parseInt(value.slice(2, 4))
  if (hours > 23 || minutes > 59) {
    return false
  }
  return true
}

export const get24HFormatTime = (value: string) => {
  if (value.length !== 4) {
    return value
  }
  const hours = value.slice(0, 2)
  const minutes = value.slice(2, 4)

  return `${hours}:${minutes}`
}

const nationalIdRegex = /([0-9]){6}-?([0-9]){4}/
const vskNrRegex = /([0-9]){6}/
const emailRegex = /^[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%&'*+/=?`{|}~^-]+)*@(?:[A-Z0-9-]+\.)+[A-Z]{2,6}$/i
const timeRegex = /^$|^(([01][0-9])|(2[0-3])):[0-5][0-9]$/

export const isValidEmail = (value: string) => emailRegex.test(value)
export const isValidVskNr = (value: string) => vskNrRegex.test(value)
export const isValidTime = (value: string) => timeRegex.test(value)
export const isValidPhoneNumber = (phoneNumber: string) => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone && phone.isValid()
}

export const displayOpeningHours = (answers: any) => {
  return (
    (answers.applicationInfo as Operation)?.operation ===
      APPLICATION_TYPES.RESTURANT ||
    (answers.applicationInfo as Operation)?.hotel?.category?.includes(
      OPERATION_CATEGORY.TWO,
    ) ||
    false
  )
}
