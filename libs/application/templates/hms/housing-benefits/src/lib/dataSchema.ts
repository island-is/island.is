import { YES } from '@island.is/application/core'
import { z } from 'zod'
import * as m from './messages'

const confirmReadSchema = z.object({
  privacyPolicy: z.array(z.literal(YES)).length(1),
  housingBenefitsInfo: z.array(z.literal(YES)).length(1),
})

const fileSchema = z.object({ key: z.string(), name: z.string() })

const exemptionReasons = ['studies', 'health', 'housing', 'work'] as const

const baseSchema = z.object({
  confirmRead: confirmReadSchema.optional(),
  confirmMunicipality: z.array(z.literal(YES)).length(1).optional(),
  approveExternalData: z.boolean().optional(),
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
})

export const dataSchema = baseSchema.superRefine((data, ctx) => {
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
  if (!reasonFiles || !Array.isArray(reasonFiles) || reasonFiles.length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['exemptionDocuments', data.exemptionReason],
      params: m.draftMessages.exemptionSection.validationFileRequired,
    })
  }
})

export type ApplicationAnswers = z.TypeOf<typeof baseSchema>
