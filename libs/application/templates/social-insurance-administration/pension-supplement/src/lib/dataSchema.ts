import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { z } from 'zod'
import { errorMessages, validatorErrorMessages } from './messages'
import { ApplicationReason } from './constants'
import addYears from 'date-fns/addYears'
import {
  formatBankInfo,
  validIBAN,
  validSWIFT,
} from '@island.is/application/templates/social-insurance-administration-core/socialInsuranceAdministrationUtils'
import { NO, YES } from '@island.is/application/types'
import { BankAccountType } from '@island.is/application/templates/social-insurance-administration-core/constants'

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
    email: z.string().email(),
    phonenumber: z.string().refine((v) => validateOptionalPhoneNumber(v), {
      params: errorMessages.phoneNumber,
    }),
  }),
  paymentInfo: z
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
      params: errorMessages.applicationReason,
    }),
  period: z
    .object({
      year: z.string(),
      month: z.string(),
    })
    .refine(
      (p) => {
        const today = new Date()
        const startDate = addYears(today, -2)
        const selectedDate = new Date(p.year + p.month)
        return startDate < selectedDate
      },
      { params: errorMessages.period },
    ),
  fileUploadAdditionalFilesRequired: z.object({
    additionalDocumentsRequired: z
      .array(FileSchema)
      .refine((a) => a.length !== 0, {
        params: validatorErrorMessages.requireAttachment,
      }),
  }),
})

export type SchemaFormValues = z.infer<typeof dataSchema>
