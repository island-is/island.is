import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { z } from 'zod'
import { NO, YES } from './constants'
import { childPensionFormMessage } from './messages'
import { formatBankInfo } from './childPensionUtils'

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
      { params: childPensionFormMessage.errors.phonenumber },
    ),
  }),
  period: z.object({
    year: z.string(),
    month: z.string(),
  }),
  paymentInfo: z.object({
    bank: z.string().refine(
      (b) => {
        const bankAccount = formatBankInfo(b)
        return bankAccount.length === 12 // 4 (bank) + 2 (ledger) + 6 (number)
      },
      { params: childPensionFormMessage.errors.bank },
    ),
  }),
  childPensionAddChild: z.enum([YES, NO]),
})

export type SchemaFormValues = z.infer<typeof dataSchema>
