import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { z } from 'zod'
import addMonths from 'date-fns/addMonths'
import addYears from 'date-fns/addYears'
import { formatBankInfo } from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'
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
      bank: z.string(),
    })
    .partial()
    .refine(
      ({ bank }) => {
        const bankAccount = formatBankInfo(bank ?? '')
        return bankAccount.length === 12 // 4 (bank) + 2 (ledger) + 6 (number)
      },
      { params: errorMessages.bank, path: ['bank'] },
    ),
  fileUploadAdditionalFilesRequired: z.object({
    additionalDocumentsRequired: z
      .array(FileSchema)
      .refine((a) => a.length !== 0, {
        params: errorMessages.requireAttachment,
      }),
  }),
  householdSupplement: z.object({
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
