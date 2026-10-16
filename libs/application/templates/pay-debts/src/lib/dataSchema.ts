import { z } from 'zod'

export const dataSchema = z.object({
  selectedDebts: z
    .array(z.boolean().nullish())
    .refine((flags) => flags.some(Boolean)),
  selectedDebtIds: z.array(z.string()),
  debtsToPay: z.array(z.string().nullish()),
})

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
