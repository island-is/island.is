import { z } from 'zod'
import { errorMessages } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { BankAccountType, TaxLevelOptions } from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import { NO, YES } from '@island.is/application/core'


const isValidPhoneNumber = (phoneNumber: string) => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone && phone.isValid()
}

const dummySchema = z.object({
  dummyTextField: z.string(),
})

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  applicant: z.object({
    email: z.string().email().min(1),
    phoneNumber: z.string().refine((v) => isValidPhoneNumber(v), {
      params: errorMessages.phoneNumber,
    }),
  }),
  paymentInfo: z
    .object({
      bankAccountType: z.enum([
        BankAccountType.ICELANDIC,
        BankAccountType.FOREIGN,
      ]),
      bank: z.string(),
      bankAddress: z.string(),
      bankName: z.string(),
      currency: z.string().nullable(),
      iban: z.string(),
      swift: z.string(),
      personalAllowance: z.enum([YES, NO]),
      personalAllowanceUsage: z.string().optional(),
      taxLevel: z.enum([
        TaxLevelOptions.INCOME,
        TaxLevelOptions.FIRST_LEVEL,
        TaxLevelOptions.SECOND_LEVEL,
      ]),
    }),
})

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
