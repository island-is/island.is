import { z } from 'zod'

import { errorMessages } from './messages'
import { MAX_DOCUMENTS } from '../utils/constants'
import { YES } from '@island.is/application/core'

const documentSchema = z.object({
  type: z.string().min(1),
  checkbox: z.array(z.string()).optional(),
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

type Document = z.infer<typeof documentSchema>

const validateDocument = (doc: Document, ctx: z.RefinementCtx) => {
  const hasComment =
    typeof doc.comment === 'string' && doc.comment.trim().length > 0
  if (!doc.checkbox?.includes(YES) && (!doc.file || doc.file.length < 1)) {
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
}

const validateDocumentCount = (docs: Document[], ctx: z.RefinementCtx) => {
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
}

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  documents: z
    .array(documentSchema.superRefine(validateDocument))
    .superRefine(validateDocumentCount),
})

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
