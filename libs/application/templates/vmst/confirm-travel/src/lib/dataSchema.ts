import { z } from 'zod'

export const dateSchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
})

export const ConfirmTravelUnemploymentBenefitsSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  date: z.array(dateSchema),
})

export type ConfirmTravelUnemploymentBenefits = z.TypeOf<
  typeof ConfirmTravelUnemploymentBenefitsSchema
>
