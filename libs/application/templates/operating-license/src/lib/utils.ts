import { ApplicationTypes, Operation, OperationCategory } from './constants'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { EMAIL_REGEX, getValueViaPath, YES } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'

type ValidationOperation = {
  operation?: ApplicationTypes

  type?: string
  category?: OperationCategory | '' | undefined
}

export const validateApplicationInfoCategory = ({
  operation,
  category,
}: ValidationOperation) => {
  if (operation === ApplicationTypes.RESTURANT) {
    return (
      category === OperationCategory.TWO || category === OperationCategory.THREE
    )
  } else {
    return (
      category === OperationCategory.TWO ||
      category === OperationCategory.THREE ||
      category === OperationCategory.FOUR
    )
  }
}

const getHoursMinutes = (value: string) => {
  return {
    hours: parseInt(value.slice(0, 2)),
    minutes: parseInt(value.slice(2, 4)),
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

  return `${hours}:${minutes > 10 ? minutes : '0' + minutes}`
}

const vskNrRegex = /([0-9]){6}/
const timeRegex = /^$|^(([01][0-9])|(2[0-3])):[0-5][0-9]$/

export const getCurrencyString = (n: number) =>
  n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'
export const isValidEmail = (value: string) => EMAIL_REGEX.test(value)
export const isValidVskNr = (value: string) => vskNrRegex.test(value)
export const isValidTime = (value: string) => timeRegex.test(value)
export const isValidPhoneNumber = (phoneNumber: string) => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone && phone.isValid()
}

export const displayOpeningHours = (answers: FormValue) => {
  const operation = getValueViaPath<ApplicationTypes>(
    answers,
    'applicationInfo.operation',
  )
  const category = getValueViaPath<
    OperationCategory | Array<OperationCategory>
  >(answers, 'applicationInfo.category')
  return (
    operation === ApplicationTypes.RESTURANT ||
    category?.includes(OperationCategory.FOUR) ||
    false
  )
}

export const getChargeItemCode = (answers: FormValue) => {
  const applicationInfo = getValueViaPath<Operation>(answers, 'applicationInfo')
  const isHotel = applicationInfo?.operation === ApplicationTypes.HOTEL
  switch (applicationInfo?.category) {
    case OperationCategory.TWO:
      return isHotel ? 'AY121' : 'AY124'
    case OperationCategory.THREE:
      return isHotel ? 'AY122' : 'AY125'
    case OperationCategory.FOUR:
      return 'AY123'
    default:
      break
  }
}

export const allowFakeCondition =
  (result = YES) =>
  (answers: FormValue) =>
    getValueViaPath(answers, 'fakeData.useFakeData') === result
