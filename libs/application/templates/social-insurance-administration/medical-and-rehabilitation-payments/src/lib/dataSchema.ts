import { NO, YES } from '@island.is/application/core'
import { TaxLevelOptions } from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import { formatBankInfo } from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'
import { errorMessages as coreSIAErrorMessages } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { z } from 'zod'
import { NOT_APPLICABLE } from './constants'
import { errorMessages } from './messages'

const isValidPhoneNumber = (phoneNumber: string) => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone && phone.isValid()
}

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  applicantInfo: z.object({
    email: z.string().email().min(1),
    phonenumber: z.string().refine((v) => isValidPhoneNumber(v), {
      params: coreSIAErrorMessages.phoneNumber,
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
      { params: coreSIAErrorMessages.bank, path: ['bank'] },
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
        params: coreSIAErrorMessages.personalAllowance,
      },
    )
    .refine(
      ({ personalAllowance, personalAllowanceUsage }) =>
        personalAllowance === YES ? !!personalAllowanceUsage : true,
      { path: ['personalAllowanceUsage'] },
    ),  
  questions: z
    .object({
      isSelfEmployed: z.enum([YES, NO]),
      isPartTimeEmployed: z.enum([YES, NO]),
      isStudying: z.enum([YES, NO]),
      calculatedRemunerationDate: z.string().optional(),
    })
    .refine(
      ({ isSelfEmployed, calculatedRemunerationDate }) =>
        isSelfEmployed === YES ? !!calculatedRemunerationDate : true,
      {
        path: ['calculatedRemunerationDate'],
        params: errorMessages.dateRequired,
      },
    ),
  employeeSickPay: z
    .object({
      option: z.enum([YES, NO, NOT_APPLICABLE]),
      doesEndDate: z.string().optional(),
      didEndDate: z.string().optional(),
    })
    .refine(
      ({ option, didEndDate }) => (option === YES ? !!didEndDate : true),
      {
        path: ['didEndDate'],
        params: errorMessages.dateRequired,
      },
    )
    .refine(
      ({ option, doesEndDate }) => (option === NO ? !!doesEndDate : true),
      {
        path: ['doesEndDate'],
        params: errorMessages.dateRequired,
      },
    ),
})

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
