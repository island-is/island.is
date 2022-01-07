import { error } from './messages/index'
import * as z from 'zod'
import { HomeCircumstances } from '@island.is/financial-aid/shared/lib'

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v, {
    params: error.validation.dataGathering,
  }),
  // homeCircumstances: z
  //   .enum([
  //     HomeCircumstances.WITHPARENTS,
  //     HomeCircumstances.WITHOTHERS,
  //     HomeCircumstances.OWNPLACE,
  //     HomeCircumstances.REGISTEREDLEASE,
  //     HomeCircumstances.UNREGISTEREDLEASE,
  //     HomeCircumstances.OTHER,
  //   ])
  //   .refine((v) => v, {
  //     params: error.validation.radioErrorMessage,
  //   }),

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
