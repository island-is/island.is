import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { MessageDescriptor } from '@formatjs/intl'
import { z } from 'zod'
import { EMAIL_REGEX } from '@island.is/application/core'

const isValidEmail = (value: string) => EMAIL_REGEX.test(value)

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
  errorMessage: MessageDescriptor,
  arrayLength?: number,
) => {
  const arrLength = arrayLength || 1
  return z.array(z.string()).refine((v) => v && v.length === arrLength, {
    params: errorMessage,
  })
}

export const validateContactInfo = (
  errors: Record<'email' | 'phone', MessageDescriptor>,
) => {
  return z.object({
    email: z.string().refine((v) => isValidEmail(v), {
      params: errors.email,
    }),
    phoneNumber: z.string().refine((v) => isValidPhoneNumber(v), {
      params: errors.phone,
    }),
    presentationPhone: z.string().refine((v) => isValidPhoneNumber(v), {
      params: errors.phone,
    }),
  })
}

export const validateCounterParty = (
  errors: Record<'email' | 'phone' | 'counterParty', MessageDescriptor>,
) => {
  return z
    .object({
      email: z.string().refine((v) => validateOptionalEmail(v), {
        params: errors.email,
      }),
      phoneNumber: z.string().refine((v) => validateOptionalPhoneNumber(v), {
        params: errors.phone,
      }),
      presentationPhone: z
        .string()
        .refine((v) => validateOptionalPhoneNumber(v), {
          params: errors.phone,
        }),
    })
    .refine((v) => v.email || v.phoneNumber, {
      params: errors.counterParty,
    })
}
