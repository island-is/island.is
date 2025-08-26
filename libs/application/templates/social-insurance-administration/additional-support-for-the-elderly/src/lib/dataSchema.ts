import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { z } from 'zod'
import { errorMessages } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import addMonths from 'date-fns/addMonths'
import subMonths from 'date-fns/subMonths'
import { TaxLevelOptions } from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import { formatBankInfo } from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'
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
  applicant: z.object({
    email: z.string().email().min(1),
    phoneNumber: z.string().refine((v) => validateOptionalPhoneNumber(v), {
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
  fileUploadAdditionalFilesRequired: z.object({
    additionalDocumentsRequired: z
      .array(FileSchema)
      .refine((a) => a.length !== 0, {
        params: errorMessages.requireAttachment,
      }),
  }),
  period: z
    .object({
      year: z.string(),
      month: z.string(),
    })
    .refine(
      (p) => {
        const startDate = subMonths(new Date(), 3)
        const endDate = addMonths(new Date(), 6)
        const selectedDate = new Date(p.year + p.month)
        return startDate < selectedDate && selectedDate < endDate
      },
      { params: errorMessages.period, path: ['month'] },
    ),
  higherPayments: z.object({
    question: z.enum([YES, NO]),
  }),
  infoCheckbox: z.array(z.enum([YES])).nonempty(),
})

export type SchemaFormValues = z.infer<typeof dataSchema>
