import { z } from 'zod'
import { errorMessages } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { BankAccountType, TaxLevelOptions } from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import { NO, YES } from '@island.is/application/core'
import { formatBankInfo, validIBAN, validSWIFT } from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'
import { isValidPhoneNumber } from './utils'


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
    })
    .partial()
    .refine(
      ({ bank, bankAccountType }) => {
        if (bankAccountType === BankAccountType.ICELANDIC) {
          const bankAccount = formatBankInfo(bank ?? '')
          return bankAccount.length === 12 // 4 (bank) + 2 (ledger) + 6 (number)
        }
        return true
      },
      { params: errorMessages.bank, path: ['bank'] },
    )
    .refine(
      ({ iban, bankAccountType }) => {
        if (bankAccountType === BankAccountType.FOREIGN) {
          const formattedIBAN = iban?.replace(/[\s]+/g, '')
          return formattedIBAN ? validIBAN(formattedIBAN) : false
        }
        return true
      },
      { params: errorMessages.iban, path: ['iban'] },
    )
    .refine(
      ({ swift, bankAccountType }) => {
        if (bankAccountType === BankAccountType.FOREIGN) {
          const formattedSWIFT = swift?.replace(/[\s]+/g, '')
          return formattedSWIFT ? validSWIFT(formattedSWIFT) : false
        }
        return true
      },
      { params: errorMessages.swift, path: ['swift'] },
    )
    .refine(
      ({ bankName, bankAccountType }) =>
        bankAccountType === BankAccountType.FOREIGN ? !!bankName : true,
      { path: ['bankName'] },
    )
    .refine(
      ({ bankAddress, bankAccountType }) =>
        bankAccountType === BankAccountType.FOREIGN ? !!bankAddress : true,
      { path: ['bankAddress'] },
    )
    .refine(
      ({ currency, bankAccountType }) =>
        bankAccountType === BankAccountType.FOREIGN ? !!currency : true,
      { path: ['currency'] },
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
