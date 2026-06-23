import { z } from 'zod'

import { errorMessages } from './messages'
import { MAX_DOCUMENTS } from '../utils/constants'
import { YES } from '@island.is/application/core'

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  documents: z
    .array(
      z
        .object({
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
        })
        .superRefine((doc, ctx) => {
          const hasComment =
            typeof doc.comment === 'string' && doc.comment.trim().length > 0
          if (
            !doc.checkbox?.includes(YES) &&
            (!doc.file || doc.file.length < 1)
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['file'],
              params: {
                ...errorMessages.documentsNoDocNoCheckbox,
              },
            })
          }
          if (doc.checkbox?.includes(YES) && !hasComment) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['comment'],
              params: {
                ...errorMessages.documentsNoDocNoCommentError,
              },
            })
          }
        }),
    )
    .superRefine((docs, ctx) => {
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
