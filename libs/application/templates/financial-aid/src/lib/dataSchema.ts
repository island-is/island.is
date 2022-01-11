import { error } from './messages/index'
import * as z from 'zod'
import { isValidEmail } from './utils'
import { TwoTypeAnswers } from './types'

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v, {
    params: error.validation.dataGathering,
  }),
  spouse: z.object({
    email: z.string().refine((v) => isValidEmail(v), {
      params: error.validation.email,
    }),
    approveTerms: z.boolean().refine((v) => v, {
      params: error.validation.approveSpouse,
    }),
  }),
  student: z
    .object({
      isStudent: z
        .enum([TwoTypeAnswers.Yes, TwoTypeAnswers.No])
        .refine((v) => v, {
          params: error.validation.approveSpouse,
        }),
      custom: z.string().optional(),
    })
    .refine((v) => (v.isStudent === TwoTypeAnswers.Yes ? v.custom : true), {
      params: error.validation.approveSpouse,
      path: ['custom'],
    }),
})

export type answersSchema = z.infer<typeof dataSchema>
