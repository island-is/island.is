import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { z } from 'zod'
import { NO, YES } from './constants'
import { pensionSupplementFormMessage } from './messages'

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  questions: z.object({
    pensionFund: z.enum([YES, NO]),
    abroad: z.enum([YES, NO]),
  }),
  applicantInfo: z.object({
    email: z.string().email(),
    phonenumber: z.string().refine(
      (p) => {
        const phoneNumber = parsePhoneNumberFromString(p, 'IS')
        const phoneNumberStartStr = ['6', '7', '8']
        return (
          phoneNumber &&
          phoneNumber.isValid() &&
          phoneNumberStartStr.some((substr) =>
            phoneNumber.nationalNumber.startsWith(substr),
          )
        )
      },
      { params: pensionSupplementFormMessage.errors.phonenumber },
    ),
  }),
})

export type SchemaFormValues = z.infer<typeof dataSchema>
