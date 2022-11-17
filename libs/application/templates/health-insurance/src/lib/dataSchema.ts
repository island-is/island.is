import * as z from 'zod'
import { NO, YES } from '../shared'

export const HealthInsuranceSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  status: z.object({
    type: z.enum(['employed', 'student', 'pensioner', 'other']),
  }),
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
  formerInsurance: z.object({
    registration: z.enum([YES, NO]),
    country: z.string().min(1),
    personalId: z.string().min(1),
    institution: z.string().min(1),
    entitlementReason: z.string().optional(),
  }),
  children: z.enum([YES, NO]),
  hasAdditionalInfo: z.enum([YES, NO]),
  additionalRemarks: z.string().optional(),
  confirmCorrectInfo: z.boolean().refine((v) => v),
})
