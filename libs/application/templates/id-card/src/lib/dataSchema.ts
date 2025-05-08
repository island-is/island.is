import { z } from 'zod'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { error } from './messages'
import { Services } from '../shared/types'
import { EMAIL_REGEX, NATIONAL_ID_REGEX } from '@island.is/application/core'

const isValidEmail = (value: string) => EMAIL_REGEX.test(value)
const isValidPhoneNumber = (phoneNumber: string) => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone && phone.isValid()
}

const personInfo = z.object({
  name: z.string(),
  nationalId: z.string(),
  email: z
    .string()
    .refine((v) => isValidEmail(v), { params: error.invalidValue }),
  phoneNumber: z.string().refine((v) => isValidPhoneNumber(v), {
    params: error.invalidValue,
  }),
  hasDisabilityLicense: z.boolean().optional(),
})

export const IdCardSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  typeOfId: z.enum(['II', 'ID']), //II = Nafnskírteini sem ferðaskilríki, ID = Nafnskírteini ekki sem ferðaskilríki
  chosenApplicants: z.string().min(1),
  applicantInformation: personInfo,
  firstGuardianInformation: personInfo,
  secondGuardianInformation: z.object({
    name: z.string().min(1),
    nationalId: z
      .string()
      .refine((x) => (x ? NATIONAL_ID_REGEX.test(x) : false)),
    email: z.string().refine((v) => isValidEmail(v) || v === '', {
      params: error.invalidValue,
    }),
    phoneNumber: z.string().refine((v) => isValidPhoneNumber(v) || v === '', {
      params: error.invalidValue,
    }),
    approved: z.boolean().optional(),
  }),
  priceList: z.object({
    priceChoice: z.enum([Services.EXPRESS, Services.REGULAR]),
  }),
})

export type IdCard = z.TypeOf<typeof IdCardSchema>
