import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { z } from 'zod'
import { errorMessages } from './messages'

const isValidPhoneNumber = (phoneNumber: string) => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone && phone.isValid()
}

const validateOptionalPhoneNumber = (value: string) => {
  return isValidPhoneNumber(value) || value === ''
}

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  applicantInfo: z.object({
    email: z.string().email(),
    phonenumber: z.string().refine((v) => validateOptionalPhoneNumber(v), {
      params: errorMessages.phoneNumber,
    }),
  }),
})
export type SchemaFormValues = z.infer<typeof dataSchema>
