import { error } from './messages/index'
import * as z from 'zod'
import {
  Employment,
  HomeCircumstances,
} from '@island.is/financial-aid/shared/lib'
import { isValidEmail } from './utils'
import { ApproveOptions } from './types'

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
  student: z
    .object({
      isStudent: z
        .enum([ApproveOptions.Yes, ApproveOptions.No])
        .refine((v) => v, {
          params: error.validation.radioErrorMessage,
        }),
      custom: z.string().optional(),
    })
    .refine((v) => (v.isStudent === ApproveOptions.Yes ? v.custom : true), {
      params: error.validation.inputErrorMessage,
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
  income: z.enum([ApproveOptions.Yes, ApproveOptions.No]).refine((v) => v, {
    params: error.validation.radioErrorMessage,
  }),
  employment: z
    .object({
      type: z
        .enum([
          Employment.WORKING,
          Employment.UNEMPLOYED,
          Employment.CANNOTWORK,
          Employment.OTHER,
        ])
        .refine((v) => v, {
          params: error.validation.radioErrorMessage,
        }),
      custom: z.string().optional(),
    })
    .refine((v) => (v.type === Employment.OTHER ? v.custom : true), {
      params: error.validation.inputErrorMessage,
      path: ['custom'],
    }),
  personalTaxCreditForm: z
    .enum([ApproveOptions.Yes, ApproveOptions.No])
    .refine((v) => v, {
      params: error.validation.radioErrorMessage,
    }),
  contactInfo: z.object({
    email: z.string().refine((v) => v, {
      params: error.validation.inputErrorMessage,
    }),
    phoneNumber: z.string().refine((v) => v, {
      params: error.validation.inputErrorMessage,
    }),
  }),
})

export type answersSchema = z.infer<typeof dataSchema>
