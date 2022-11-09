import * as z from 'zod'
import { NO, YES } from '../shared'

export const HealthInsuranceSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  applicant: z.object({
    name: z.string(),
    nationalId: z.string(),
    address: z.string(),
    postalCode: z.string(),
    city: z.string(),
    email: z.string().email(),
    phoneNumber: z.string().optional(),
    citizenship: z.string().optional(),
  }),
  children: z.string().min(1),
  hasAdditionalInfo: z.enum([YES, NO]),
  additionalRemarks: z.string().optional(),
  confirmCorrectInfo: z.boolean().refine((v) => v),
})
