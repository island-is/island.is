import * as z from 'zod'
import { applicantInformation } from './messages'
import { isValidNumber } from 'libphonenumber-js'
import { applicantInformationProps } from './types'

const emailRegex =
  /^[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%&'*+/=?`{|}~^-]+)*@(?:[A-Z0-9-]+\.)+[A-Z]{2,6}$/i
const isValidEmail = (value: string) => emailRegex.test(value)

export const applicantInformationSchema = (
  props?: applicantInformationProps,
) => {
  const { phoneRequired = false, emailRequired = true } = props ?? {}
  return z.object({
    name: z.string(),
    nationalId: z.string(),
    address: z.string(),
    postalCode: z.string(),
    city: z.string(),
    email: z
      .string()
      .refine(
        (x) => (emailRequired ? isValidEmail(x) : !x || isValidEmail(x)),
        {
          params: applicantInformation.error.email,
        },
      ),
    phoneNumber: z
      .string()
      .refine(
        (x) => (phoneRequired ? isValidNumber(x) : !x || isValidNumber(x)),
        {
          params: applicantInformation.error.phoneNumber,
        },
      ),
  })
}
