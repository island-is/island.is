import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { z } from 'zod'
import { NO, YES } from './constants'
import { pensionSupplementFormMessage } from './messages'
import { formatBankInfo } from './pensionSupplementUtils'
import { ApplicationReason } from './constants'

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
      { params: pensionSupplementFormMessage.errors.phoneNumber },
    ),
  }),
  paymentInfo: z.object({
    bank: z.string().refine(
      (b) => {
        const bankAccount = formatBankInfo(b)
        return bankAccount.length === 12 // 4 (bank) + 2 (ledger) + 6 (number)
      },
      { params: pensionSupplementFormMessage.errors.bank },
    ),
  }),
  applicationReason: z
    .array(
      z.enum([
        ApplicationReason.MEDICINE_COST,
        ApplicationReason.ASSISTED_CARE_AT_HOME,
        ApplicationReason.OXYGEN_FILTER_COST,
        ApplicationReason.PURCHASE_OF_HEARING_AIDS,
        ApplicationReason.ASSISTED_LIVING,
        ApplicationReason.HALFWAY_HOUSE,
        ApplicationReason.HOUSE_RENT,
      ]),
    )
    .refine((a) => a.length !== 0, {
      params: pensionSupplementFormMessage.errors.applicationReason,
    }),
})

export type SchemaFormValues = z.infer<typeof dataSchema>
