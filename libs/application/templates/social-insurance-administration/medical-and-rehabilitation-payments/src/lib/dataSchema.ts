import { NO, YES } from '@island.is/application/core'
import { TaxLevelOptions } from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import { errorMessages } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { formatBankInfo } from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'
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
  paymentInfo: z
  .object({
    bank: z.string(),
    personalAllowance: z.enum([YES, NO]),
    personalAllowanceUsage: z.string().optional(),
    taxLevel: z.enum([
      TaxLevelOptions.INCOME,
      TaxLevelOptions.FIRST_LEVEL,
      TaxLevelOptions.SECOND_LEVEL,
    ]),
  })
  .partial()
  .refine(
    ({ bank }) => {
      const bankAccount = formatBankInfo(bank ?? '')
      return bankAccount.length === 12 // 4 (bank) + 2 (ledger) + 6 (number)
    },
    { params: errorMessages.bank, path: ['bank'] },
  )
  .refine(
    ({ personalAllowance, personalAllowanceUsage }) =>
      personalAllowance === YES
        ? !(
            Number(personalAllowanceUsage) < 1 ||
            Number(personalAllowanceUsage) > 100
          )
        : true,
    {
      path: ['personalAllowanceUsage'],
      params: errorMessages.personalAllowance,
    },
  )
  .refine(
    ({ personalAllowance, personalAllowanceUsage }) =>
      personalAllowance === YES ? !!personalAllowanceUsage : true,
    { path: ['personalAllowanceUsage'] },
  ),
})

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
