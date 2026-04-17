import { z } from 'zod'

export const DeregisterUnemploymentBenefitsSchema = z.object({
  deregistrationDate: z.string().min(1),
  reason: z.string().min(1),
})

export type DeregisterUnemploymentBenefits = z.TypeOf<
  typeof DeregisterUnemploymentBenefitsSchema
>
