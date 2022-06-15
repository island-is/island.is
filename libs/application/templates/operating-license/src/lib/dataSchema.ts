import * as z from 'zod'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { error } from './error'
import { APPLICATION_TYPES, OPERATION_CATEGORY } from './constants'

const nationalIdRegex = /([0-9]){6}-?([0-9]){4}/
const emailRegex = /^[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%&'*+/=?`{|}~^-]+)*@(?:[A-Z0-9-]+\.)+[A-Z]{2,6}$/i
const isValidEmail = (value: string) => emailRegex.test(value)
const isValidPhoneNumber = (phoneNumber: string) => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone && phone.isValid()
}

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  operation: z.enum([APPLICATION_TYPES.HOTEL, APPLICATION_TYPES.RESTURANT]),
  hotel: z.object({
    type: z.string().nonempty(),
    category: z
      .array(z.enum([OPERATION_CATEGORY.ONE, OPERATION_CATEGORY.TWO]))
      .optional(),
  }),
  resturant: z.object({
    type: z.string().nonempty(),
    category: z.enum([OPERATION_CATEGORY.ONE, OPERATION_CATEGORY.TWO]),
  }),

  info: z.object({
    email: z
      .string()
      .refine((v) => isValidEmail(v), { params: error.invalidValue }),
    phoneNumber: z
      .string()
      .min(7)
      .refine((v) => isValidPhoneNumber(v), { params: error.invalidValue }),
  }),
})

export type PassportSchema = z.TypeOf<typeof dataSchema>
