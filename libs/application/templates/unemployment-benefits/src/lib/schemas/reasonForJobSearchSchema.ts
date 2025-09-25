import { z } from 'zod'
import { FileSchema } from './fileSchema'

export const reasonForJobSearchSchema = z
  .object({
    mainReason: z.string(),
    additionalReason: z.string(),
    additionalReasonTextRequired: z.boolean(),
    additionalReasonText: z.string().optional(),
    healthReasonRequired: z.boolean(),
    healthReason: z.array(FileSchema).optional(),
    bankruptsyReason: z.array(z.string()).optional(),
    agreementConfirmation: z.array(z.string()).optional(),
  })
  .refine(
    ({ additionalReasonText, additionalReasonTextRequired }) => {
      if (additionalReasonTextRequired === true) {
        return !!additionalReasonText
      }
      return true
    },
    { path: ['additionalReasonText'] },
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
