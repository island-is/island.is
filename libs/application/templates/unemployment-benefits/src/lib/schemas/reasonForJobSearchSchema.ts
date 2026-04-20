import { z } from 'zod'
import { FileSchema } from './fileSchema'
import { YES } from '@island.is/application/core'

export const reasonForJobSearchSchema = z
  .object({
    mainReason: z.string(),
    additionalReason: z.string().optional(),
    additionalReasonRequired: z.boolean().optional(),
    healthReasonRequired: z.boolean().optional(),
    healthReason: z.array(FileSchema).optional(),
    bankruptsyReasonRequired: z.boolean().optional(),
    bankruptsyReason: z.array(z.string()).optional(),
    agreementConfirmation: z.array(z.string()).refine((v) => v.includes(YES)),
    reasonQuestion: z.string().optional(),
    reasonQuestionRequired: z.boolean().optional(),
    extraFileUpload: z.array(FileSchema).optional(),
    attachmentTypeId: z.string().optional(),
  })
  .refine(
    ({ reasonQuestion, reasonQuestionRequired }) => {
      if (reasonQuestionRequired === true) {
        return !!reasonQuestion
      }
      return true
    },
    { path: ['reasonQuestion'] },
  )
  .refine(
    ({ healthReason, healthReasonRequired }) => {
      if (healthReasonRequired === true) {
        return !!healthReason
      }
      return true
    },
    { path: ['healthReason'] },
  )
  .refine(
    ({ bankruptsyReason, bankruptsyReasonRequired }) => {
      if (bankruptsyReasonRequired === true) {
        return !!bankruptsyReason && bankruptsyReason.length > 0
      }
      return true
    },
    { path: ['bankruptsyReason'] },
  )
  .refine(
    ({ additionalReason, additionalReasonRequired }) => {
      if (additionalReasonRequired === true) {
        return !!additionalReason
      }
      return true
    },
    { path: ['additionalReason'] },
  )
