import { z } from 'zod'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { error } from './messages'
import { Services } from './constants'

const nationalIdRegex = /([0-9]){6}-?([0-9]){4}/
const emailRegex =
  /^[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%&'*+/=?`{|}~^-]+)*@(?:[A-Z0-9-]+\.)+[A-Z]{2,6}$/i
const isValidEmail = (value: string) => emailRegex.test(value)
const isValidPhoneNumber = (phoneNumber: string) => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone && phone.isValid()
}

const guardian = z.object({
  name: z.string().min(1),
  nationalId: z.string().refine((x) => (x ? nationalIdRegex.test(x) : false)),
  email: z
    .string()
    .refine((v) => isValidEmail(v), { params: error.invalidValue }),
  phoneNumber: z
    .string()
    .min(7)
    .refine((v) => isValidPhoneNumber(v), { params: error.invalidValue }),
})

export const IdCardSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  typeOfId: z.enum(['WithTravel', 'WithoutTravel']),
  applicantInformation: z
    .object({
      applicantName: z.string(),
      applicantNationalId: z.string(),
      applicantEmail: z.string().optional(),
      applicantPhoneNumber: z.string().optional(),

      firstGuardianName: z.string().optional(),
      firstGuardianNationalId: z.string().optional(),
      firstGuardianEmail: z.string().optional(),
      firstGuardianPhoneNumber: z.string().optional(),

      secondGuardianName: z.string().optional(),
      secondGuardianNationalId: z.string().optional(),
      secondGuardianEmail: z.string().optional(),
      secondGuardianPhoneNumber: z.string().optional(),
    })
    .refine((x) => {
      return true
    }),
  priceList: z.object({
    priceChoice: z.enum([
      Services.EXPRESS,
      Services.EXPRESS_DISCOUNT,
      Services.REGULAR,
      Services.REGULAR_DISCOUNT,
    ]),
    location: z.string(),
  }),
  //   passport: z
  //     .object({
  //       userPassport: z.string(),
  //       childPassport: z.string(),
  //     })
  //     .partial()
  //     .refine(
  //       ({ userPassport, childPassport }) => userPassport || childPassport,
  //       {
  //         message: error.invalidValue.defaultMessage,
  //         path: ['userPassport'],
  //       },
  //     ),
  //   personalInfo: z.object({
  //     name: z.string().min(1),
  //     nationalId: z.string().refine((x) => (x ? nationalIdRegex.test(x) : false)),
  //     email: z
  //       .string()
  //       .refine((v) => isValidEmail(v), { params: error.invalidValue }),
  //     phoneNumber: z
  //       .string()
  //       .refine((v) => isValidPhoneNumber(v), { params: error.invalidValue }),
  //     disabilityCheckbox: z.array(z.string()).optional(),
  //     hasDisabilityLicense: z.boolean().optional(),
  //   }),
  //   childsPersonalInfo: z.object({
  //     name: z.string().min(1),
  //     nationalId: z.string().refine((x) => (x ? nationalIdRegex.test(x) : false)),
  //     guardian1: guardian,
  //     guardian2: guardian.optional(),
  //   }),
  //   service: z.object({
  //     type: z.enum([Services.REGULAR, Services.EXPRESS]),
  //     dropLocation: z.string().min(1),
  //   }),
  //   approveExternalDataParentB: z.boolean().refine((v) => v),
  //   chargeItemCode: z.string(),
})

export type IdCard = z.TypeOf<typeof IdCardSchema>
