import { z } from 'zod'
import { YES, YesOrNoEnum } from '@island.is/application/core'
import { serviceErrors } from './messages'
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
import { reasonForJobSearchSchema } from './schemas/reasonForJobSearchSchema'

const FileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})

export const languageSkillsSchema = z.object({
  language: z.string().nullish(),
  skill: z
    .string()
    .optional()
    .refine((v) => v !== undefined && v !== '', {
      params: serviceErrors.requiredError,
    }),
})

const euresSchema = z.object({
  agreement: z
    .nativeEnum(YesOrNoEnum)
    .refine((v) => Object.values(YesOrNoEnum).includes(v)),
})

export const resumeSchema = z.object({
  doesOwnResume: z
    .nativeEnum(YesOrNoEnum)
    .refine((v) => Object.values(YesOrNoEnum).includes(v)),
  resumeFile: z.array(FileSchema).optional(),
})

export const introductoryMeetingSchema = z.object({
  language: z.string(),
})

export const workingAbilitySchema = z.object({
  status: z.string(),
  medicalReport: z.array(FileSchema).optional(),
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
