import { z } from 'zod'

import { errorMessages } from './messages'
import { MAX_DOCUMENTS } from '../utils/constants'

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  documents: z
    .array(
      z.object({
        type: z.string().min(1),
        checkbox: z.array(z.string().optional()).optional(),
        file: z
          .array(
            z.object({
              key: z.string().min(1),
              name: z.string().min(1),
            }),
          )
          .optional(),
        comment: z.string().nullish(),
      }),
    )
    .superRefine((docs, ctx) => {
      // if (docs.length < 1) {
      //   ctx.addIssue({
      //     code: z.ZodIssueCode.custom,
      //     params: errorMessages.documentsMinError,
      //   })
      // }
      if (docs.length > MAX_DOCUMENTS) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [docs.length - 1, 'type'],
          params: {
            ...errorMessages.documentsMaxError,
            values: { max: MAX_DOCUMENTS },
          },
        })
      }
    }),
})

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
