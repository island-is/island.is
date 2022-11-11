import { applicantInformationSchema } from '@island.is/application/ui-forms'
import * as z from 'zod'
import { NO, YES } from '../shared'

export const HealthInsuranceSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  applicant: applicantInformationSchema,
  citizenship: z.string().optional(),
  children: z.string().min(1),
  hasAdditionalInfo: z.enum([YES, NO]),
  additionalRemarks: z.string().optional(),
  confirmCorrectInfo: z.boolean().refine((v) => v),
})
