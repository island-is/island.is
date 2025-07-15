import { z } from 'zod'
import { YES, YesOrNoEnum } from '@island.is/application/core'
import { application } from './messages'
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
  drivingLicenseSchema,
} from './schemas'
import { EmploymentStatus } from '../shared'

const FileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})

const currentJobSchema = z
  .object({
    employer: z
      .object({
        nationalId: z.string().optional(),
        name: z.string().optional(),
      })
      .optional(),
    nationalIdWithName: z.string().optional(),
    percentage: z.string().optional(),
    startDate: z.string().optional(),
    workHours: z.string().optional(),
    salary: z.string().optional(),
    endDate: z.string().optional(),
    title: z.string().optional(),
  })
  .refine(
    ({ percentage, employer }) => {
      if (employer) {
        return !!percentage
      }
      return true
    },
    {
      path: ['percentage'],
    },
  )
  .refine(
    ({ startDate, employer }) => {
      if (employer) {
        return !!startDate
      }
      return true
    },
    {
      path: ['startDate'],
    },
  )
  .refine(
    ({ workHours, employer }) => {
      if (employer) {
        return !!workHours
      }
      return true
    },
    {
      path: ['workHours'],
    },
  )
  .refine(
    ({ salary, employer }) => {
      if (employer) {
        return !!salary
      }
      return true
    },
    {
      path: ['salary'],
    },
  )
  .refine(
    ({ title, employer }) => {
      if (employer) {
        return !!title
      }
      return true
    },
    {
      path: ['title'],
    },
  )

const currentSituationSchema = z
  .object({
    status: z.string().min(1),
    currentJob: currentJobSchema.optional(),
    currentSituationRepeater: z.array(currentJobSchema),
  })
  .refine(
    ({ status, currentJob }) => {
      if (status === EmploymentStatus.EMPLOYED) {
        return !!currentJob?.endDate
      }
      return true
    },
    {
      path: ['endDate'],
    },
  )

const languageSkillsSchema = z.object({
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

const introductoryMeetingSchema = z.object({
  language: z.string(),
})

export const UnemploymentBenefitsSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  applicant: applicantInformationSchema,
  familyInformation: familyInformationSchema,
  currentSituation: currentSituationSchema,
  educationHistory: educationHistorySchema,
  education: educationSchema,
  drivingLicense: drivingLicenseSchema,
  languageSkills: z.array(languageSkillsSchema),
  euresJobSearch: euresSchema,
  resume: resumeSchema,
  employmentHistory: employmentHistorySchema,
  payout: payoutSchema,
  taxDiscount: taxDiscountSchema,
  vacation: vacationSchema,
  otherBenefits: otherBenefitsSchema,
  capitalIncome: capitalIncomeSchema,
  jobWishes: jobWishesSchema,
  informationChangeAgreement: z
    .array(z.string())
    .refine((v) => v.includes(YES), {
      params: application.iUnderstandError,
    }),
  introductoryMeeting: introductoryMeetingSchema,
  concurrentWorkAgreement: z.array(z.string()).refine((v) => v.includes(YES), {
    params: application.iUnderstandError,
  }),
  yourRightsAgreement: z.array(z.string()).refine((v) => v.includes(YES), {
    params: application.iUnderstandError,
  }),
  lossOfRightsAgreement: z.array(z.string()).refine((v) => v.includes(YES), {
    params: application.iUnderstandError,
  }),
  employmentSearchConfirmationAgreement: z
    .array(z.string())
    .refine((v) => v.includes(YES), {
      params: application.iUnderstandError,
    }),
  interviewAndMeetingAgreement: z
    .array(z.string())
    .refine((v) => v.includes(YES), {
      params: application.iUnderstandError,
    }),
  introductoryMeetingAgreement: z
    .array(z.string())
    .refine((v) => v.includes(YES), {
      params: application.iUnderstandError,
    }),
  unemploymentBenefitsPayoutAgreement: z
    .array(z.string())
    .refine((v) => v.includes(YES), {
      params: application.iUnderstandError,
    }),
  vacationsAndForeginWorkAgreement: z
    .array(z.string())
    .refine((v) => v.includes(YES), {
      params: application.iUnderstandError,
    }),
})

export type UnemploymentBenefits = z.TypeOf<typeof UnemploymentBenefitsSchema>
