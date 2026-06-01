import { z } from 'zod'

import { errorMessages } from './messages'

const MAX_DOCUMENTS = 10

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
    .superRefine((docs, ctx) => {
      if (docs.length < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          params: errorMessages.documentsMinError,
        })
      }
      if (docs.length > MAX_DOCUMENTS) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [docs.length - 1, 'type'],
          params: errorMessages.documentsMaxError,
        })
      }
    }),
})

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
