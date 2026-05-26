import { z } from 'zod'
import { errorMessages } from './messages'

export const dateSchema = z
  .object({
    from: z.string().min(1),
    to: z.string().min(1),
  })
  .refine(
    (data) => {
      const fromDate = new Date(data.from)
      const toDate = new Date(data.to)
      return toDate >= fromDate
    },
    {
      path: ['to'],
      params: errorMessages.dateMustBeGreater,
    },
  )

export const ConfirmTravelUnemploymentBenefitsSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  date: dateSchema,
})

export type ConfirmTravelUnemploymentBenefits = z.TypeOf<
  typeof ConfirmTravelUnemploymentBenefitsSchema
>

export type DateInAnswers = z.TypeOf<typeof dateSchema>
