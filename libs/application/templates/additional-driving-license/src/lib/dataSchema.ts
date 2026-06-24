import { z } from 'zod'
import { Pickup } from './types'
import { AdvancedLicense, B_ADVANCED, BE } from './constants'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
const isValidPhoneNumber = (phoneNumber: string) => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone && phone.isValid()
}
const FileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})
export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  delivery: z
    .object({
      deliveryMethod: z.enum([Pickup.POST, Pickup.DISTRICT]).optional(),
      jurisdiction: z.string().nullish(),
    })
    .refine(({ deliveryMethod, jurisdiction }) => {
      return deliveryMethod === Pickup.DISTRICT ? !!jurisdiction : true
    }),
  healthCertificate: z.array(FileSchema).nonempty(),
  requirementsMet: z.boolean().refine((v) => v),
  applicationFor: z.enum([BE, B_ADVANCED]),
  advancedLicense: z
    .array(z.enum(Object.values(AdvancedLicense) as [string, ...string[]]))
    .nonempty()
    .refine((value) => {
      return value.length > 0
    }),
  email: z.string().email(),
  phone: z.string().refine((v) => isValidPhoneNumber(v)),
})

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
