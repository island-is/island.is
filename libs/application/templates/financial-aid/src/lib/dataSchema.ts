import { error } from './messages/index'
import * as z from 'zod'
import { HomeCircumstances } from '@island.is/financial-aid/shared/lib'
import { isValidEmail } from './utils'

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v, {
    params: error.validation.dataGathering,
  }),
  spouse: z.object({
    email: z.string().refine((v) => isValidEmail(v), {
      params: error.validation.email,
    }),
    approveTerms: z.array(z.string()).refine((v) => v && v.length === 1, {
      params: error.validation.approveSpouse,
    }),
  }),
  homeCircumstances: z
    .object({
      type: z
        .enum([
          HomeCircumstances.WITHPARENTS,
          HomeCircumstances.WITHOTHERS,
          HomeCircumstances.OWNPLACE,
          HomeCircumstances.REGISTEREDLEASE,
          HomeCircumstances.UNREGISTEREDLEASE,
          HomeCircumstances.OTHER,
        ])
        .refine((v) => v, {
          params: error.validation.radioErrorMessage,
        }),
      custom: z.string().optional(),
    })
    .refine((v) => (v.type === HomeCircumstances.OTHER ? v.custom : true), {
      params: error.validation.inputErrorMessage,
      path: ['custom'],
    }),
})

export type answersSchema = z.infer<typeof dataSchema>
