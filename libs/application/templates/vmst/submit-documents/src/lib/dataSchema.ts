import { z } from 'zod'

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  documents: z
    .array(
      z.object({
        type: z.string().min(1),
        file: z
          .array(
            z.object({
              key: z.string().min(1),
              name: z.string().min(1),
            }),
          )
          .min(1),
        comment: z.string().min(1),
      }),
    )
    .min(1),
})

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
