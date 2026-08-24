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
  // Required-ness is enforced in Questionnaire's setBeforeSubmitCallback,
  // so allow empty/null values here to avoid blocking that callback.
  questionnaire: z.record(z.string(), z.string().nullish()).nullish(),
})

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
