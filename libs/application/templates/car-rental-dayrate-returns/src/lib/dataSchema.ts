import { z } from 'zod'

const fileSchema = z.object({
  name: z.string(),
  key: z.string(),
})

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  carDayRateUsageFile: z.array(fileSchema).min(1),
})

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
