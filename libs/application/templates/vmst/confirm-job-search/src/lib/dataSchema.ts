import { z } from 'zod'

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  jobSearchItems: z
    .array(
      z.object({
        companyName: z.string().min(1),
      }),
    )
    .optional(),
  questionnaire: z.record(z.string(), z.string()).optional(),
})

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
