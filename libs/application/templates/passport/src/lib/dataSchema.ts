import * as z from 'zod'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { error } from './error'
import { Services } from './constants'

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
    email: z
      .string()
      .email()
      .refine((v) => isValidEmail(v), { params: error.invalidValue }),
    phoneNumber: z
      .string()
      .min(7)
      .refine((v) => isValidPhoneNumber(v), { params: error.invalidValue }),
    isPassportLost: z.array(z.string()).optional(),
  }),
  service: z.object({
    type: z.enum([Services.REGULAR, Services.EXPRESS]),
    dropLocation: z.string().nonempty(),
    authentication: z.string().nonempty(),
  }),
  overview: z.object({
    willBringPassport: z.array(z.string()).optional(),
  }),
})

export type PassportSchema = z.TypeOf<typeof dataSchema>
