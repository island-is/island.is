import { errorMessages } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { z } from 'zod'

const isValidPhoneNumber = (phoneNumber: string) => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone && phone.isValid()
}

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  applicantInfo: z.object({
    email: z.string().email().min(1),
    phonenumber: z.string().refine((v) => isValidPhoneNumber(v), {
      params: errorMessages.phoneNumber,
    }),
  }),
})

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
