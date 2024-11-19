import { error } from './messages/index'
import { z } from 'zod'
import {
  Employment,
  HomeCircumstances,
} from '@island.is/financial-aid/shared/lib'
import { isValidEmail, isValidNationalId, isValidPhone } from './utils'
import { ApproveOptions } from './types'

const fileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})

const approveExternalDataSchema = z.boolean().refine((v) => v, {
  params: error.validation.dataGathering,
})

const spouseSchema = z.object({
  email: z.string().refine((v) => isValidEmail(v), {
    params: error.validation.email,
  }),
  approveTerms: z.array(z.string()).refine((v) => v && v.length === 1, {
    params: error.validation.approveSpouse,
  }),
})

const childSchoolInfoSchema = z.object({
  fullName: z.string(),
  nationalId: z.string(),
  school: z.string(),
  livesWithApplicant: z.boolean(),
  livesWithBothParents: z.boolean(),
})

const relationshipStatusScema = z
  .object({
    unregisteredCohabitation: z.nativeEnum(ApproveOptions).refine((v) => v, {
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

const incomeSchema = z.object({
  type: z.nativeEnum(ApproveOptions).refine((v) => v, {
    params: error.validation.radioErrorMessage,
  }),
})

const incomeFilesSchema = z.array(fileSchema)
// .refine((v) => v.length > 0, { params: error.validation.missingFiles })

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

const bankInfoSchema = z.object({
  bankNumber: z.string().optional(),
  ledger: z.string().optional(),
  accountNumber: z.string().optional(),
})

const personalTexCreditSchema = z.object({
  type: z.nativeEnum(ApproveOptions).refine((v) => v, {
    params: error.validation.radioErrorMessage,
  }),
})

const contactInfoSchema = z.object({
  email: z.string().refine((v) => isValidEmail(v), {
    params: error.validation.email,
  }),
  phone: z.string().refine((v) => isValidPhone(v), {
    params: error.validation.phone,
  }),
})

const spouseIncomeSchema = z.object({
  type: z.nativeEnum(ApproveOptions).refine((v) => v, {
    params: error.validation.radioErrorMessage,
  }),
})

const spouseContactInfoSchema = z.object({
  email: z.string().refine((v) => isValidEmail(v), {
    params: error.validation.email,
  }),
  phone: z.string().refine((v) => isValidPhone(v), {
    params: error.validation.phone,
  }),
})

export const dataSchema = z.object({
  // Validation for ApplicationForm
  approveExternalData: approveExternalDataSchema,
  spouse: spouseSchema,
  childrenSchoolInfo: z.array(childSchoolInfoSchema),
  childrenComment: z.string().optional(),
  relationshipStatus: relationshipStatusScema,
  student: studentSchema,
  homeCircumstances: homeCircumstancesSchema,
  income: incomeSchema,
  incomeFiles: incomeFilesSchema,
  taxReturnFiles: z.array(fileSchema).optional(),
  spouseIncomeFiles: z.array(fileSchema).optional(),
  spouseTaxReturnFiles: z.array(fileSchema).optional(),
  childrenFiles: z.array(fileSchema).optional(),
  employment: employmentSchema,
  bankInfo: bankInfoSchema,
  personalTaxCredit: personalTexCreditSchema,
  contactInfo: contactInfoSchema,
  formComment: z.string().optional(),
  // Validation for SpouseForm
  approveExternalDataSpouse: approveExternalDataSchema,
  spouseIncome: spouseIncomeSchema,
  spouseContactInfo: spouseContactInfoSchema,
  spouseFormComment: z.string().optional(),
  spouseName: z.string().optional(),
})

export type AnswersSchema = z.infer<typeof dataSchema>
