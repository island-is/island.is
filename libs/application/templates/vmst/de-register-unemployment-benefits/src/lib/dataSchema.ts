import { z } from 'zod'

export const DeregisterUnemploymentBenefitsSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  deregistrationDate: z.string().min(1),
  reason: z.string().min(1),
})

export type DeregisterUnemploymentBenefits = z.TypeOf<
  typeof DeregisterUnemploymentBenefitsSchema
>
