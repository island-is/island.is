import { EMAIL_REGEX, YES } from '@island.is/application/core'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { z } from 'zod'
import * as kennitala from 'kennitala'
import * as m from './messages'

const isValidPhoneNumber = (phoneNumber: string) => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return !!phone && phone.isValid()
}

const isValidEmail = (value: string) => EMAIL_REGEX.test(value)

const confirmReadSchema = z.object({
  privacyPolicy: z.array(z.literal(YES)).length(1),
  housingBenefitsInfo: z.array(z.literal(YES)).length(1),
})

const fileSchema = z.object({ key: z.string(), name: z.string() })

const exemptionReasons = ['studies', 'health', 'housing', 'work'] as const

const bankAccountSchema = z.object({
  bankNumber: z.string().optional(),
  ledger: z.string().optional(),
  accountNumber: z.string().optional(),
})

const nationalIdWithNameSchema = z.object({
  nationalId: z.string().optional(),
  name: z.string().optional(),
})

const applicantSchema = z.object({
  name: z.string().min(1),
  nationalId: z
    .string()
    .refine((nationalId) => nationalId && kennitala.isValid(nationalId)),
  address: z.string().min(1),
  postalCode: z.string().optional(),
  city: z.string().min(1),
  postalCodeAndCity: z.string().optional(),
  email: z.string().refine((v) => isValidEmail(v)),
  phoneNumber: z
    .string()
    .optional()
    .refine((v) => !v || isValidPhoneNumber(v)),
})

const householdMemberRowSchema = z.object({
  nationalIdWithName: nationalIdWithNameSchema,
  file: z.array(fileSchema).optional(),
})

const baseSchema = z.object({
  confirmRead: confirmReadSchema.optional(),
  confirmMunicipality: z.array(z.literal(YES)).length(1).optional(),
  approveExternalData: z.boolean().optional(),
  applicant: applicantSchema.optional(),
  rentalAgreement: z
    .object({
      answer: z.string().min(1),
    })
    .optional(),
  exemptionCheckbox: z.array(z.string()).optional(),
  exemptionReason: z.enum(exemptionReasons).optional(),
  exemptionDocuments: z
    .object({
      studies: z.array(fileSchema).optional(),
      health: z.array(fileSchema).optional(),
      housing: z.array(fileSchema).optional(),
      work: z.array(fileSchema).optional(),
    })
    .optional(),
  householdMembersTableRepeater: z.array(householdMemberRowSchema).optional(),
  incomeDisplayField: z.string().optional(),
  incomeFileUploadField: z.array(fileSchema).optional(),
  payment: z
    .object({
      paymentRadio: z.enum(['me', 'landlord']).optional(),
      bankAccount: bankAccountSchema.nullish(),
      landlordSelection: z.string().nullish(),
      // clearOnChange sets these to "" when switching to "me"; must accept string
      landlordBankAccount: z
        .union([bankAccountSchema, z.string(), z.null()])
        .optional(),
    })
    .superRefine((payment, ctx) => {
      const paymentRadio = payment.paymentRadio
      if (paymentRadio !== 'me' && paymentRadio !== 'landlord') return

      if (paymentRadio === 'me') {
        const bankAccount = payment.bankAccount
        const bankNumber = bankAccount?.bankNumber?.trim() ?? ''
        const ledger = bankAccount?.ledger?.trim() ?? ''
        const accountNumber = bankAccount?.accountNumber?.trim() ?? ''
        if (!bankNumber || !ledger || !accountNumber) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['bankAccount'],
            params:
              m.draftMessages.paymentSection.validationBankAccountRequired,
          })
        }
      } else {
        const landlordBankAccount = payment.landlordBankAccount as
          | { bankNumber?: string; ledger?: string; accountNumber?: string }
          | undefined
        const bankNumber = landlordBankAccount?.bankNumber?.trim() ?? ''
        const ledger = landlordBankAccount?.ledger?.trim() ?? ''
        const accountNumber = landlordBankAccount?.accountNumber?.trim() ?? ''
        if (!bankNumber || !ledger || !accountNumber) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['landlordBankAccount'],
            params:
              m.draftMessages.paymentSection
                .validationLandlordBankAccountRequired,
          })
        }
      }
    })
    .optional(),
})

export const dataSchema = baseSchema
  .superRefine((data, ctx) => {
    const hasExemptionData =
      data.exemptionCheckbox !== undefined ||
      data.exemptionReason !== undefined ||
      data.exemptionDocuments !== undefined

    if (!hasExemptionData) return

    if (!data.exemptionCheckbox?.includes(YES)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['exemptionCheckbox'],
        params: m.draftMessages.exemptionSection.validationCheckboxRequired,
      })
      return
    }

    if (
      !data.exemptionReason ||
      !exemptionReasons.includes(data.exemptionReason)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['exemptionReason'],
        params: m.draftMessages.exemptionSection.validationReasonRequired,
      })
      return
    }

    const reasonFiles = data.exemptionDocuments?.[data.exemptionReason]
    if (
      !reasonFiles ||
      !Array.isArray(reasonFiles) ||
      reasonFiles.length === 0
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['exemptionDocuments', data.exemptionReason],
        params: m.draftMessages.exemptionSection.validationFileRequired,
      })
    }
  })
  .superRefine((data, ctx) => {
    // Household members validation - when rental agreement is selected, require at least one member with valid nationalId
    if (data.rentalAgreement?.answer && data.householdMembersTableRepeater) {
      const rows = data.householdMembersTableRepeater
      if (rows.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['householdMembersTableRepeater'],
          params:
            m.draftMessages.householdMembersSection.validationAtLeastOneMember,
        })
      }
      rows.forEach((row, index) => {
        const natId = row.nationalIdWithName?.nationalId?.trim()
        if (!natId || !kennitala.isValid(natId)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [
              'householdMembersTableRepeater',
              index,
              'nationalIdWithName',
              'nationalId',
            ],
            params:
              m.draftMessages.householdMembersSection
                .validationNationalIdRequired,
          })
        }
      })
    }
  })

export type ApplicationAnswers = z.TypeOf<typeof baseSchema>
