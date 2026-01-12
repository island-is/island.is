import { z } from 'zod'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { error } from './error'
import { Services } from './constants'
import { EMAIL_REGEX, NATIONAL_ID_REGEX } from '@island.is/application/core'

const isValidEmail = (value: string) => EMAIL_REGEX.test(value)
const isValidPhoneNumber = (phoneNumber: string) => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone && phone.isValid()
}

const guardian = z.object({
  name: z.string().min(1),
  nationalId: z.string().refine((x) => (x ? NATIONAL_ID_REGEX.test(x) : false)),
  email: z
    .string()
    .refine((v) => isValidEmail(v), { params: error.invalidValue }),
  phoneNumber: z
    .string()
    .min(7)
    .refine((v) => isValidPhoneNumber(v), { params: error.invalidValue }),
})

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  passport: z
    .object({
      userPassport: z.string(),
      childPassport: z.string(),
    })
    .partial()
    .refine(
      ({ userPassport, childPassport }) => userPassport || childPassport,
      {
        message: error.invalidValue.defaultMessage,
        path: ['userPassport'],
      },
    ),
  personalInfo: z.object({
    name: z.string().min(1),
    nationalId: z
      .string()
      .refine((x) => (x ? NATIONAL_ID_REGEX.test(x) : false)),
    email: z
      .string()
      .refine((v) => isValidEmail(v), { params: error.invalidValue }),
    phoneNumber: z
      .string()
      .refine((v) => isValidPhoneNumber(v), { params: error.invalidValue }),
    disabilityCheckbox: z.array(z.string()).optional(),
    hasDisabilityLicense: z.boolean().optional(),
  }),
  childsPersonalInfo: z.object({
    name: z.string().min(1),
    nationalId: z
      .string()
      .refine((x) => (x ? NATIONAL_ID_REGEX.test(x) : false)),
    guardian1: guardian,
    guardian2: guardian.optional(),
  }),
  service: z.object({
    type: z.enum([Services.REGULAR, Services.EXPRESS]),
  }),
  approveExternalDataParentB: z.boolean().refine((v) => v),
  chargeItemCode: z.string(),
})

export type PassportSchema = z.TypeOf<typeof dataSchema>
