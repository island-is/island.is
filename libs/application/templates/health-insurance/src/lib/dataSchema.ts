import { applicantInformationSchema } from '@island.is/application/ui-forms'
import * as z from 'zod'
import { NO, YES } from '../shared'

export const HealthInsuranceSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  applicant: applicantInformationSchema,
  children: z.string().nonempty(),
  hasAdditionalInfo: z.enum([YES, NO]),
  additionalRemarks: z.string().optional(),
  confirmCorrectInfo: z.boolean().refine((v) => v),
})
