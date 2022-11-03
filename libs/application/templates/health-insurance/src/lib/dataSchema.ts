import { applicantInformationSchema } from '@island.is/application/ui-forms'
import * as z from 'zod'
import { NO, YES } from '../shared'

const nationalIdRegex = /([0-9]){6}-?([0-9]){4}/

export const HealthInsuranceSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  applicant: applicantInformationSchema,
  children: z.string().nonempty(),
  hasAdditionalInfo: z.enum([YES, NO]),
  additionalRemarks: z.string().optional(),
  confirmCorrectInfo: z.boolean().refine((v) => v),
})
