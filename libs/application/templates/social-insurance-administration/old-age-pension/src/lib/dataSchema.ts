import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { z } from 'zod'
import {
  ApplicationType,
  BankAccountType,
  HouseholdSupplementHousing,
  NO,
  YES,
  TaxLevelOptions,
} from './constants'
import { errorMessages } from './messages'
import { formatBankInfo } from './oldAgePensionUtils'
import * as ibantools from 'ibantools'

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  applicationType: z.object({
    option: z.enum([
      ApplicationType.OLD_AGE_PENSION,
      ApplicationType.HALF_OLD_AGE_PENSION,
      ApplicationType.SAILOR_PENSION,
    ]),
  }),
  questions: z.object({
    pensionFund: z.enum([YES, NO]),
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
          (phoneNumber.country === 'IS'
            ? phoneNumberStartStr.some((substr) =>
                phoneNumber.nationalNumber.startsWith(substr),
              )
            : true)
        )
      },
      { params: errorMessages.phoneNumber },
    ),
  }),
  residenceHistory: z.object({
    question: z.enum([YES, NO]),
  }),
  period: z.object({
    year: z.string(),
    month: z.string(),
  }),
  onePaymentPerYear: z.object({
    question: z.enum([YES, NO]),
  }),
  householdSupplement: z.object({
    housing: z.enum([
      HouseholdSupplementHousing.HOUSEOWNER,
      HouseholdSupplementHousing.RENTER,
    ]),
    children: z.enum([YES, NO]),
  }),
  paymentInfo: z.object({
    bankAccountInfo: z
      .object({
        bank: z.string(),
        bankAccountType: z.enum([
          BankAccountType.ICELANDIC,
          BankAccountType.FOREIGN,
        ]),
        bankAddress: z.string(),
        bankName: z.string(),
        currency: z.string(),
        iban: z.string(),
        swift: z.string(),
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
            const formattedIBAN = ibantools.electronicFormatIBAN(iban)
            return formattedIBAN ? ibantools.isValidIBAN(formattedIBAN) : false
          }
          return true
        },
        { params: errorMessages.iban, path: ['iban'] },
      )
      .refine(
        ({ swift, bankAccountType }) => {
          if (bankAccountType === BankAccountType.FOREIGN) {
            const formattedSWIFT = swift?.replace(/[\s]+/g, '')
            return formattedSWIFT ? ibantools.isValidBIC(formattedSWIFT) : false
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
      ),

    spouseAllowance: z.enum([YES, NO]).optional(),
    spouseAllownaceUsage: z.string().optional(),
    personalAllowance: z.enum([YES, NO]),
    personalAllowanceUsage: z.string().optional(),
    taxLevel: z.enum([
      TaxLevelOptions.INCOME,
      TaxLevelOptions.FIRST_LEVEL,
      TaxLevelOptions.SECOND_LEVEL,
      TaxLevelOptions.THIRD_LEVEL,
    ]),
  }),
  childPensionAddChild: z.enum([YES, NO]),
})

export type SchemaFormValues = z.infer<typeof dataSchema>
