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

const FileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})

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
      isWorkingPartTime: z.enum([YES, NO]),
      isStudying: z.enum([YES, NO]),
      isSelfEmployedDate: z.string().optional(),
    })
    .refine(
      ({ isSelfEmployed, isSelfEmployedDate }) =>
        isSelfEmployed === YES ? !!isSelfEmployedDate : true,
      {
        path: ['isSelfEmployedDate'],
        params: errorMessages.dateRequired,
      },
    ),
  sickPay: z
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
  unionSickPay: z
    .object({
      option: z.string().optional().nullable(),
      union: z.string().optional().nullable(),
      date: z.string().optional().nullable(),
      fileupload: z.array(FileSchema).optional(),
      unionName: z.string().optional().nullable(),
    })
    .refine(
      ({ option, unionName }) => {
        // If the union name is set then we don't need to check the option
        if (unionName) {
          return true
        }

        return !!option
      },
      {
        path: ['option'],
      },
    )
    .refine(
      ({ option, union, unionName }) => {
        // If the name is set then we don't need to check the union
        if (unionName) {
          return true
        }
        console.log('unionName#2', unionName)
        return option !== NOT_APPLICABLE ? !!union : true
      },
      {
        path: ['union'],
      },
    )
    .refine(({ option, date }) => (option !== NOT_APPLICABLE ? !!date : true), {
      path: ['date'],
      params: errorMessages.dateRequired,
    })
    .refine(
      ({ option, fileupload }) =>
        option === YES && fileupload !== undefined
          ? fileupload.length !== 0
          : true,
      {
        path: ['fileupload'],
        params: coreSIAErrorMessages.requireAttachment,
      },
    ),
})

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
