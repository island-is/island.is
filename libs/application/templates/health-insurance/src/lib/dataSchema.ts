import { z } from 'zod'
import { NO, YES } from '../shared'

const nationalIdRegex = /([0-9]){6}-?([0-9]){4}/

export const HealthInsuranceSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  applicant: z.object({
    name: z.string().nonempty(),
    nationalId: z.string().refine((x) => (x ? nationalIdRegex.test(x) : false)),
    address: z.string().nonempty(),
    postalCode: z.string().min(3).max(3),
    city: z.string().nonempty(),
    email: z.string().email(),
    phoneNumber: z.string().optional(),
    citizenship: z.string().optional(),
  }),
  children: z.string().nonempty(),
  hasAdditionalInfo: z.enum([YES, NO]),
  additionalRemarks: z.string().optional(),
  confirmCorrectInfo: z.boolean().refine((v) => v),
})
