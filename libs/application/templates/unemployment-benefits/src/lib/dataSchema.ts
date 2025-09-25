import { z } from 'zod'
import { YES, YesOrNoEnum } from '@island.is/application/core'
import { application, serviceErrors } from './messages'
import {
  applicantInformationSchema,
  capitalIncomeSchema,
  educationSchema,
  employmentHistorySchema,
  otherBenefitsSchema,
  payoutSchema,
  taxDiscountSchema,
  vacationSchema,
  familyInformationSchema,
  educationHistorySchema,
  jobWishesSchema,
  licenseSchema,
  currentSituationSchema,
} from './schemas'
import { WorkingAbility } from '../shared'
import { reasonForJobSearchSchema } from './schemas/reasonForJobSearchSchema'

const FileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})

export const languageSkillsSchema = z.object({
  language: z.string(),
  skill: z.string(),
})

const euresSchema = z.object({
  agreement: z
    .nativeEnum(YesOrNoEnum)
    .refine((v) => Object.values(YesOrNoEnum).includes(v)),
})

const resumeSchema = z.object({
  doesOwnResume: z
    .nativeEnum(YesOrNoEnum)
    .refine((v) => Object.values(YesOrNoEnum).includes(v)),
  resumeFile: z.object({ file: z.array(FileSchema) }).optional(),
})

export const introductoryMeetingSchema = z.object({
  language: z.string(),
})

const workingAbilitySchema = z.object({
  status: z
    .nativeEnum(WorkingAbility)
    .refine((v) => Object.values(WorkingAbility).includes(v)),
  medicalReport: z.object({ file: z.array(FileSchema) }).optional(),
})

export const UnemploymentBenefitsSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  applicant: applicantInformationSchema,
  familyInformation: familyInformationSchema,
  currentSituation: currentSituationSchema,
  educationHistory: educationHistorySchema,
  education: educationSchema,
  licenses: licenseSchema,
  languageSkills: z.array(languageSkillsSchema),
  euresJobSearch: euresSchema,
  workingAbility: workingAbilitySchema,
  resume: resumeSchema,
  employmentHistory: employmentHistorySchema,
  reasonForJobSearch: reasonForJobSearchSchema,
  payout: payoutSchema,
  taxDiscount: taxDiscountSchema,
  vacation: vacationSchema,
  otherBenefits: otherBenefitsSchema,
  capitalIncome: capitalIncomeSchema,
  jobWishes: jobWishesSchema,
  informationChangeAgreement: z
    .array(z.string())
    .refine((v) => v.includes(YES), {
      params: serviceErrors.iUnderstandError,
    }),
  introductoryMeeting: introductoryMeetingSchema,
  concurrentWorkAgreement: z.array(z.string()).refine((v) => v.includes(YES), {
    params: serviceErrors.iUnderstandError,
  }),
  yourRightsAgreement: z.array(z.string()).refine((v) => v.includes(YES), {
    params: serviceErrors.iUnderstandError,
  }),
  lossOfRightsAgreement: z.array(z.string()).refine((v) => v.includes(YES), {
    params: serviceErrors.iUnderstandError,
  }),
  employmentSearchConfirmationAgreement: z
    .array(z.string())
    .refine((v) => v.includes(YES), {
      params: serviceErrors.iUnderstandError,
    }),
  interviewAndMeetingAgreement: z
    .array(z.string())
    .refine((v) => v.includes(YES), {
      params: serviceErrors.iUnderstandError,
    }),
  introductoryMeetingAgreement: z
    .array(z.string())
    .refine((v) => v.includes(YES), {
      params: serviceErrors.iUnderstandError,
    }),
  unemploymentBenefitsPayoutAgreement: z
    .array(z.string())
    .refine((v) => v.includes(YES), {
      params: serviceErrors.iUnderstandError,
    }),
  vacationsAndForeginWorkAgreement: z
    .array(z.string())
    .refine((v) => v.includes(YES), {
      params: serviceErrors.iUnderstandError,
    }),
})

export type UnemploymentBenefits = z.TypeOf<typeof UnemploymentBenefitsSchema>
