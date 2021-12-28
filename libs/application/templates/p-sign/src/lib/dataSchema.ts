import * as z from 'zod'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

const emailRegex = /^[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%&'*+/=?`{|}~^-]+)*@(?:[A-Z0-9-]+\.)+[A-Z]{2,6}$/i
const isValidEmail = (value: string) => emailRegex.test(value)

const isValidPhoneNumber = (phoneNumber: string) => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone && phone.isValid()
}

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  address: z.string(),
  city: z.string(),
  email: z.string().refine((v) => isValidEmail(v)),
  phone: z.string().refine((v) => isValidPhoneNumber(v)),
  name: z.string(),
  validityPeriod: z.string(),
  deliveryMethod: z.string().nonempty(),
  photoAttachment: z.string(),
  attachmentFileName: z.string(),
  district: z.string(),
  nationalId: z.string(),
  qualityPhoto: z.enum(['yes', 'no']),
})
