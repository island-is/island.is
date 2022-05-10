import { error } from './messages/index'
import * as z from 'zod'
import {
  Employment,
  HomeCircumstances,
} from '@island.is/financial-aid/shared/lib'
import { isValidEmail, isValidNationalId, isValidPhone } from './utils'
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
  relationshipStatus: z
    .object({
      unregisteredCohabitation: z
        .enum([ApproveOptions.Yes, ApproveOptions.No])
        .refine((v) => v, {
          params: error.validation.radioErrorMessage,
        }),
      spouseEmail: z.string().optional(),
      spouseNationalId: z.string().optional(),
      spouseApproveTerms: z.array(z.string()).optional(),
    })
    .refine(
      (v) =>
        v.unregisteredCohabitation === ApproveOptions.Yes
          ? v.spouseEmail &&
            isValidEmail(v.spouseEmail) &&
            v.spouseNationalId &&
            isValidNationalId(v.spouseNationalId) &&
            v.spouseApproveTerms &&
            v.spouseApproveTerms.length === 1
          : true,
      {
        //More detailed error messages are in the UnknownRelationshipForm component
        params: error.validation.email,
      },
    ),
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
  bankInfo: z.object({
    bankNumber: z.string().optional(),
    ledger: z.string().optional(),
    accountNumber: z.string().optional(),
  }),
  personalTaxCredit: z
    .enum([ApproveOptions.Yes, ApproveOptions.No])
    .refine((v) => v, {
      params: error.validation.radioErrorMessage,
    }),
  formComment: z.string().optional(),
  contactInfo: z.object({
    email: z.string().refine((v) => isValidEmail(v), {
      params: error.validation.email,
    }),
    phone: z.string().refine((v) => isValidPhone(v), {
      params: error.validation.phone,
    }),
  }),
  spouseIncome: z
    .enum([ApproveOptions.Yes, ApproveOptions.No])
    .refine((v) => v, {
      params: error.validation.radioErrorMessage,
    }),
  spouseContactInfo: z.object({
    email: z.string().refine((v) => isValidEmail(v), {
      params: error.validation.email,
    }),
    phone: z.string().refine((v) => isValidPhone(v), {
      params: error.validation.phone,
    }),
  }),
  spouseFormComment: z.string().optional(),
  fileUploadComment: z.string().optional(),
})

export type answersSchema = z.infer<typeof dataSchema>
