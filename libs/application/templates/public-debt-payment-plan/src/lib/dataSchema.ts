import * as z from 'zod'

export const PublicDebtPaymentPlanSchema = z.object({
  field: z.string(),
})

export type PublicDebtPaymentPlan = z.TypeOf<typeof PublicDebtPaymentPlanSchema>
