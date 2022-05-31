import * as z from 'zod'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

const nationalIdRegex = /([0-9]){6}-?([0-9]){4}/
const emailRegex = /^[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%&'*+/=?`{|}~^-]+)*@(?:[A-Z0-9-]+\.)+[A-Z]{2,6}$/i
const isValidEmail = (value: string) => emailRegex.test(value)
const isValidPhoneNumber = (phoneNumber: string) => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone && phone.isValid()
}

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  personalInfo: z.object({
    name: z.string().nonempty(),
    nationalId: z.string().refine((x) => (x ? nationalIdRegex.test(x) : false)),
    phoneNumber: z
      .string()
      .min(7)
      .refine((v) => isValidPhoneNumber(v)),
    email: z
      .string()
      .email()
      .refine((v) => isValidEmail(v)),
    otherEmail: z.string().email().nonempty(),
    height: z.string().nonempty(),
  }),
  /*service: z.object({
    type: z.enum(['regular', 'express']),
    dropLocation: z.enum(['1', '2', '3']),
    extraOptions: z
      .array(z.union([z.enum(['bringOwnPhoto']), z.undefined()]))
      .nonempty(),
  }),*/
})

export type PassportSchema = z.TypeOf<typeof dataSchema>
