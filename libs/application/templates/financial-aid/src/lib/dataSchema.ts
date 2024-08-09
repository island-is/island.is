import { error } from './messages/index'
import { z } from 'zod'
import {
  Employment,
  HomeCircumstances,
} from '@island.is/financial-aid/shared/lib'
import { isValidEmail, isValidNationalId, isValidPhone } from './utils'
import { ApproveOptions } from './types'

const FileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})

const childSchoolInfoSchema = z.object({
  fullName: z.string(),
  nationalId: z.string(),
  school: z.string(),
  livesWithApplicant: z.boolean(),
  livesWithBothParents: z.boolean(),
})

const bankInfoSchema = z.object({
  bankNumber: z.string().optional(),
  ledger: z.string().optional(),
  accountNumber: z.string().optional(),
})

const relationshipStatusScema = z
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
  )

const studentSchema = z
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
  })

const homeCircumstancesSchema = z
  .object({
    type: z.nativeEnum(HomeCircumstances).refine((v) => v, {
      params: error.validation.radioErrorMessage,
    }),
    custom: z.string().optional(),
  })
  .refine((v) => (v.type === HomeCircumstances.OTHER ? v.custom : true), {
    params: error.validation.inputErrorMessage,
    path: ['custom'],
  })

const employmentSchema = z
  .object({
    type: z.nativeEnum(Employment).refine((v) => v, {
      params: error.validation.radioErrorMessage,
    }),
    custom: z.string().optional(),
  })
  .refine((v) => (v.type === Employment.OTHER ? v.custom : true), {
    params: error.validation.inputErrorMessage,
    path: ['custom'],
  })

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v, {
    params: error.validation.dataGathering,
  }),
  approveExternalDataSpouse: z.boolean().refine((v) => v, {
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
  childrenSchoolInfo: z.array(childSchoolInfoSchema),
  childrenComment: z.string().optional(),
  relationshipStatus: relationshipStatusScema,
  student: studentSchema,
  homeCircumstances: homeCircumstancesSchema,
  income: z.object({
    type: z.nativeEnum(ApproveOptions).refine((v) => v, {
      params: error.validation.radioErrorMessage,
    }),
  }),
  incomeFiles: z
    .array(FileSchema)
    .refine((v) => v.length > 0, { params: error.validation.missingFiles }),
  taxReturnFiles: z.array(FileSchema).optional(),
  spouseIncomeFiles: z.array(FileSchema).optional(),
  spouseTaxReturnFiles: z.array(FileSchema).optional(),
  childrenFiles: z.array(FileSchema).optional(),
  employment: employmentSchema,
  bankInfo: bankInfoSchema,
  personalTaxCredit: z.object({
    type: z.nativeEnum(ApproveOptions).refine((v) => v, {
      params: error.validation.radioErrorMessage,
    }),
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
  spouseIncome: z.object({
    type: z.nativeEnum(ApproveOptions).refine((v) => v, {
      params: error.validation.radioErrorMessage,
    }),
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
  spouseName: z.string().optional(),
})

export type AnswersSchema = z.infer<typeof dataSchema>
