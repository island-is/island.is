import { z } from 'zod'

export const DeregisterUnemploymentBenefitsSchema = z.object({
  deregistrationDate: z.string().min(1),
  reason: z.enum([
    'movingCountries',
    'education',
    'foundJob',
    'maternityLeave',
    'cancelled',
    'unable',
    'other',
  ]),
  otherReason: z.string().optional(),
})

export type DeregisterUnemploymentBenefits = z.TypeOf<
  typeof DeregisterUnemploymentBenefitsSchema
>
