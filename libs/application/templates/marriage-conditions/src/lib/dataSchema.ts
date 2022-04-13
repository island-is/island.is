import * as z from 'zod'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import * as kennitala from 'kennitala'

const emailRegex = /^[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%&'*+/=?`{|}~^-]+)*@(?:[A-Z0-9-]+\.)+[A-Z]{2,6}$/i
const isValidEmail = (value: string) => emailRegex.test(value)

const isValidPhoneNumber = (phoneNumber: string) => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone && phone.isValid()
}

const individualInfo = z.object({
  nationalId: z.string().refine((x) => (x ? kennitala.isPerson(x) : false)),
  name: z.string().refine((v) => v),
  phone: z.string().refine((v) => isValidPhoneNumber(v)),
  email: z.string().refine((v) => isValidEmail(v)),
})

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  applicant: individualInfo,
  spouse: individualInfo,
  witness1: individualInfo,
  witness2: individualInfo,
})
