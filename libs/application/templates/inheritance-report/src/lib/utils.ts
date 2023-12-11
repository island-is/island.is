import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { MessageDescriptor } from 'react-intl'
import { ZodTypeAny } from 'zod'
import { EstateInfo } from '@island.is/clients/syslumenn'

const emailRegex =
  /^[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%&'*+/=?`{|}~^-]+)*@(?:[A-Z0-9-]+\.)+[A-Z]{2,6}$/i

export const isValidEmail = (value: string) => emailRegex.test(value)

export const isValidPhoneNumber = (phoneNumber: string) => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone && phone.isValid()
}

export const customZodError = (
  zodValidation: ZodTypeAny,
  errorMessage: MessageDescriptor,
): ZodTypeAny => {
  if (zodValidation._def.checks) {
    for (const check of zodValidation._def.checks) {
      check['params'] = errorMessage
      check['code'] = 'custom_error'
    }
  }
  return zodValidation
}

export function isEstateInfo(
  data: string | number | boolean | object | undefined,
): data is { estate: EstateInfo } {
  return (data as { estate: EstateInfo })?.estate?.nameOfDeceased !== undefined
}

export const isValidString = (string: string | undefined) =>
  string && /\S/.test(string)

export const isNumericalString = (string: string | undefined) =>
  string && /^[0-9]+$|^[0-9][0-9,.]+[0-9]$/.test(string)

export const convertToShare = (numericValueStr: string) => {
  const convertedValue = parseFloat(numericValueStr).toFixed(2)
  return Number(convertedValue) / 100
}

export const customCurrencyFormat = (input: number | string): string => {
  if (typeof input === 'number') {
    return `${input.toLocaleString('de-DE')} kr.`
  } else if (typeof input === 'string') {
    const decimal = getDecimal(input)

    switch (decimal) {
      case ',':
        return `${Number(input.replace(decimal, '.')).toLocaleString(
          'de-DE',
        )} kr.`
      case '.':
        return `${Number(input).toLocaleString('de-DE')} kr.`
      default:
        break
    }
  }

  return `${input} kr.`
}

const getDecimal = (input: string): false | string => {
  const decimalCount = (input.match(/,/g) || []).length
  const periodCount = (input.match(/\./g) || []).length

  if (decimalCount === 1 && periodCount === 0) {
    return ','
  }

  if (decimalCount === 0 && periodCount === 1) {
    return '.'
  }

  return false
}
