import { z } from 'zod'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { error } from './messages'
import { Services } from '../shared/types'

const nationalIdRegex = /([0-9]){6}-?([0-9]){4}/
const emailRegex =
  /^[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%&'*+/=?`{|}~^-]+)*@(?:[A-Z0-9-]+\.)+[A-Z]{2,6}$/i
const isValidEmail = (value: string) => emailRegex.test(value)
const isValidPhoneNumber = (phoneNumber: string) => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone && phone.isValid()
}

const personInfo = z
  .object({
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
  .refine((x) => {
    return true
  })

export const IdCardSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  typeOfId: z.enum(['II', 'ID']), //II = Nafnskírteini sem ferðaskilríki, ID = Nafnskírteini ekki sem ferðaskilríki
  chosenApplicants: z.string().min(1),
  applicantInformation: personInfo,
  firstGuardianInformation: personInfo,
  secondGuardianInformation: z.object({
    name: z.string().min(1),
    nationalId: z.string().refine((x) => (x ? nationalIdRegex.test(x) : false)),
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
