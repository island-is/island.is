import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { z } from 'zod'
import { HouseholdSupplementHousing } from './constants'
import addMonths from 'date-fns/addMonths'
import addYears from 'date-fns/addYears'
import {
  formatBankInfo,
  validIBAN,
  validSWIFT,
} from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'
import { BankAccountType } from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import { errorMessages } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { NO, YES } from '@island.is/application/core'

const isValidPhoneNumber = (phoneNumber: string) => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone && phone.isValid()
}

const validateOptionalPhoneNumber = (value: string) => {
  return isValidPhoneNumber(value) || value === ''
}

const FileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  questions: z.object({
    pensionFund: z.enum([YES, NO]),
    abroad: z.enum([YES, NO]),
  }),
  applicantInfo: z.object({
    email: z.string().email().min(1),
    phonenumber: z.string().refine((v) => validateOptionalPhoneNumber(v), {
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
    ),
  fileUploadAdditionalFilesRequired: z.object({
    additionalDocumentsRequired: z
      .array(FileSchema)
      .refine((a) => a.length !== 0, {
        params: errorMessages.requireAttachment,
      }),
  }),
  householdSupplement: z.object({
    housing: z.enum([
      HouseholdSupplementHousing.HOUSEOWNER,
      HouseholdSupplementHousing.RENTER,
    ]),
    children: z.enum([YES, NO]),
  }),
  period: z
    .object({
      year: z.string(),
      month: z.string(),
    })
    .refine(
      (p) => {
        const today = new Date()
        const startDate = addYears(today.setMonth(today.getMonth()), -2)
        const endDate = addMonths(new Date(), 6)
        const selectedDate = new Date(p.year + p.month)
        return startDate < selectedDate && selectedDate < endDate
      },
      { params: errorMessages.period, path: ['month'] },
    ),
})

export type SchemaFormValues = z.infer<typeof dataSchema>
