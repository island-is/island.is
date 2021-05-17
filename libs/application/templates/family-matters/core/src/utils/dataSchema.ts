import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { MessageDescriptor } from '@formatjs/intl'
import * as z from 'zod'

const emailRegex = /^[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%&'*+/=?`{|}~^-]+)*@(?:[A-Z0-9-]+\.)+[A-Z]{2,6}$/i
const isValidEmail = (value: string) => emailRegex.test(value)

const isValidPhoneNumber = (phoneNumber: string) => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone && phone.isValid()
}

const validateOptionalEmail = (value: string) => {
  return (value && isValidEmail(value)) || value === ''
}

const validateOptionalPhoneNumber = (value: string) => {
  return isValidPhoneNumber(value) || value === ''
}

export const validateTerms = (
  arrayLength: number,
  errorMessage: MessageDescriptor,
) => {
  return z.array(z.string()).refine((v) => v && v.length === arrayLength, {
    params: errorMessage,
  })
}

export const validateContactInfo = (
  emailErrorMessage: MessageDescriptor,
  phoneErrorMessage: MessageDescriptor,
) => {
  return z.object({
    email: z.string().refine((v) => isValidEmail(v), {
      params: emailErrorMessage,
    }),
    phoneNumber: z.string().refine((v) => isValidPhoneNumber(v), {
      params: phoneErrorMessage,
    }),
  })
}

export const validateCounterParty = (
  counterPartyError: MessageDescriptor,
  emailErrorMessage: MessageDescriptor,
  phoneErrorMessage: MessageDescriptor,
) => {
  return z
    .object({
      email: z.string().refine((v) => validateOptionalEmail(v), {
        params: emailErrorMessage,
      }),
      phoneNumber: z.string().refine((v) => validateOptionalPhoneNumber(v), {
        params: phoneErrorMessage,
      }),
    })
    .refine((v) => v.email || v.phoneNumber, {
      params: counterPartyError,
    })
}
