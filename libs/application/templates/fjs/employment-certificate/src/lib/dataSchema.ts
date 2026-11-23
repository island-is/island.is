import { z } from 'zod'
import { EMAIL_REGEX } from '@island.is/application/core'
import { COMMENT_MAX_LENGTH, YES } from '../utils/constants'
import { employmentHistory, personalInformation } from './messages'

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  applicant: z.object({
    name: z.string(),
    nationalId: z.string(),
    // Read-only from the user's profile, which may have no email.
    email: z
      .string()
      .optional()
      .refine((value) => !value || EMAIL_REGEX.test(value), {
        params: personalInformation.emailError,
      }),
  }),
  previewVersion: z.string().min(1),
  institutionIds: z.array(z.string()).refine((ids) => ids.length > 0, {
    params: employmentHistory.noneSelectedError,
  }),
  includeUnion: z.array(z.enum([YES])).optional(),
  comment: z
    .string()
    .optional()
    .refine((value) => (value ?? '').trim().length <= COMMENT_MAX_LENGTH, {
      params: {
        ...employmentHistory.commentTooLong,
        values: { max: COMMENT_MAX_LENGTH },
      },
    }),
})

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
