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

export const institutionRequestedDocumentTypes = [
  'exemptionReason',
  'custodyAgreement',
  'changedCircumstances',
] as const

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

const householdMemberRowSchema = z
  .object({
    nationalIdWithName: nationalIdWithNameSchema.optional(),
    file: z.array(fileSchema).optional(),
  })
  .passthrough() // TableRepeater adds isRemoved, isUnsaved, etc.

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
  exemptionCheckbox: z
    .union([z.array(z.string()), z.literal('')])
    .optional()
    .transform((v) => (v === '' ? undefined : v)),
  exemptionReason: z
    .union([z.enum(exemptionReasons), z.literal('')])
    .optional()
    .transform((v) => (v === '' ? undefined : v)),
  exemptionDocuments: z
    .object({
      studies: z
        .union([z.array(fileSchema), z.literal('')])
        .optional()
        .transform((v) => (v === '' ? undefined : v)),
      health: z
        .union([z.array(fileSchema), z.literal('')])
        .optional()
        .transform((v) => (v === '' ? undefined : v)),
      housing: z
        .union([z.array(fileSchema), z.literal('')])
        .optional()
        .transform((v) => (v === '' ? undefined : v)),
      work: z
        .union([z.array(fileSchema), z.literal('')])
        .optional()
        .transform((v) => (v === '' ? undefined : v)),
    })
    .optional(),
  householdMembersTableRepeater: z
    .array(householdMemberRowSchema)
    .optional()
    .nullable(),
  householdMemberApprovals: z.array(z.string()).optional(),
  assigneeApproval: z
    .object({
      confirmRead: z.array(z.string()).optional(),
    })
    .optional(),
  approveOrReject: z
    .enum(['approve', 'reject', 'requestExtraData'])
    .optional(),
  approveOrRejectReason: z.string().optional(),
  // clearOnChange on approveOrReject sets this to ""; normalize away
  institutionRequestedDocuments: z
    .union([
      z.array(z.enum(institutionRequestedDocumentTypes)),
      z.literal(''),
    ])
    .optional()
    .transform((v) => (v === '' ? undefined : v)),
  institutionMessageToApplicant: z.string().optional(),
  extraDataAttachments: z
    .object({
      exemptionReason: z
        .union([z.array(fileSchema), z.literal('')])
        .optional()
        .transform((v) => (v === '' ? undefined : v)),
      custodyAgreement: z
        .union([z.array(fileSchema), z.literal('')])
        .optional()
        .transform((v) => (v === '' ? undefined : v)),
      changedCircumstances: z
        .union([z.array(fileSchema), z.literal('')])
        .optional()
        .transform((v) => (v === '' ? undefined : v)),
    })
    .optional(),
  incomeTextField: z.string().optional(),
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
    // Only validate exemption when user has explicitly requested one (checked the box).
    // Skip validation when exemption section was never shown (address matches) or not completed.
    const hasRequestedExemption = data.exemptionCheckbox?.includes(YES)

    if (!hasRequestedExemption) return

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
    // Household members validation - when rental agreement is selected and user has added rows,
    // validate each row has valid nationalId. Contract tenants from the rental agreement
    // are displayed via getStaticTableData and are NOT in householdMembersTableRepeater,
    // so it is valid for this to be empty when only contract tenants exist.
    // Skip isRemoved rows (TableRepeater marks these before submit cleanup).
    const rows = data.rentalAgreement?.answer
      ? Array.isArray(data.householdMembersTableRepeater)
        ? data.householdMembersTableRepeater
        : []
      : []
    rows.forEach((row, index) => {
      if ((row as { isRemoved?: boolean }).isRemoved) return
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
  })
  .superRefine((data, ctx) => {
    if (data.approveOrReject !== 'reject') return
    const reason = data.approveOrRejectReason?.trim()
    if (!reason) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['approveOrRejectReason'],
        params: m.institutionMessages.validationRejectionReasonRequired,
      })
    }
  })
  .superRefine((data, ctx) => {
    if (data.approveOrReject !== 'requestExtraData') return
    const docs = data.institutionRequestedDocuments ?? []
    if (docs.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['institutionRequestedDocuments'],
        params: m.institutionMessages.validationExtraDataDocumentsRequired,
      })
    }
    const message = data.institutionMessageToApplicant?.trim()
    if (!message) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['institutionMessageToApplicant'],
        params: m.institutionMessages.validationExtraDataMessageRequired,
      })
    }
  })
  .superRefine((data, ctx) => {
    const requested = data.institutionRequestedDocuments
    if (!requested?.length) return
    const att = data.extraDataAttachments
    if (!att) return

    const requireFiles = (key: (typeof institutionRequestedDocumentTypes)[number]) => {
      if (!requested.includes(key)) return
      const files = att[key]
      if (!Array.isArray(files) || files.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['extraDataAttachments', key],
          params: m.extraDataMessages.validationFileRequired,
        })
      }
    }

    requireFiles('exemptionReason')
    requireFiles('custodyAgreement')
    requireFiles('changedCircumstances')
  })

export type ApplicationAnswers = z.TypeOf<typeof baseSchema>
