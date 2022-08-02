import {
  APPLICATION_TYPES,
  Operation,
  OPERATION_CATEGORY,
  YES,
} from './constants'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { string } from 'zod'
import { OpeningHour } from './constants'
import { Application } from '@island.is/api/schema'
import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'

type ValidationOperation = {
  operation?: APPLICATION_TYPES
  hotel?: {
    type?: string
    category?: OPERATION_CATEGORY[] | undefined
  }
  resturant?: {
    type?: string
    category?: OPERATION_CATEGORY | '' | undefined
  }
}

export const validateApplicationInfoCategory = ({
  operation,
  hotel,
  resturant,
}: ValidationOperation) => {
  if (operation === APPLICATION_TYPES.RESTURANT) {
    return (
      resturant?.category === OPERATION_CATEGORY.ONE ||
      resturant?.category === OPERATION_CATEGORY.TWO
    )
  } else {
    return true
  }
}

export const hasYes = (answer: any) => {
  if (Array.isArray(answer)) {
    return answer.includes(YES)
  }
  if (answer instanceof Object) {
    return Object.values(answer).includes(YES)
  }
  return answer === YES
}
const getHoursMinutes = (value: string) => {
  return {
    hours: parseInt(value.slice(0, 2)),
    minutes: parseInt(value.slice(0, 2)),
  }
}

export const isValid24HFormatTime = (value: string) => {
  if (value.length !== 4) {
    return false
  }
  const { hours, minutes } = getHoursMinutes(value)
  if (hours > 23 || minutes > 59) {
    return false
  }
  return true
}

export const get24HFormatTime = (value: string) => {
  if (value.length !== 4) {
    return value
  }
  const { hours, minutes } = getHoursMinutes(value)

  return `${hours}:${minutes}`
}

// TODO: Opening hours can exceed midnight how to validate
export const isValidFromToTime = ({ from, to }: OpeningHour) => {
  const { hours: fH, minutes: fM } = getHoursMinutes(from)
  const { hours: tH, minutes: tM } = getHoursMinutes(to)
}

const nationalIdRegex = /([0-9]){6}-?([0-9]){4}/
const vskNrRegex = /([0-9]){6}/
const emailRegex = /^[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%&'*+/=?`{|}~^-]+)*@(?:[A-Z0-9-]+\.)+[A-Z]{2,6}$/i
const timeRegex = /^$|^(([01][0-9])|(2[0-3])):[0-5][0-9]$/

export const getCurrencyString = (n: number) =>
  n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'
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

export const getChargeItemCode = (answers: FormValue) => {
  const applicationInfo = getValueViaPath(
    answers,
    'applicationInfo',
  ) as Operation
  if (
    applicationInfo.operation === APPLICATION_TYPES.RESTURANT &&
    applicationInfo.resturant.category
  ) {
    if (applicationInfo.resturant.category === OPERATION_CATEGORY.ONE) {
      return 'AY123'
    } else if (applicationInfo.resturant.category === OPERATION_CATEGORY.TWO) {
      return 'AY122'
    }
  } else if (applicationInfo.operation === APPLICATION_TYPES.HOTEL) {
    if (applicationInfo.hotel.category) {
      if (
        applicationInfo.hotel.category.length > 1 ||
        applicationInfo.hotel.category.includes(OPERATION_CATEGORY.TWO)
      ) {
        return 'AY123'
      } else if (
        applicationInfo.hotel.category.includes(OPERATION_CATEGORY.ONE)
      ) {
        return 'AY122'
      }
    } else {
      return 'AY121'
    }
  }
}
