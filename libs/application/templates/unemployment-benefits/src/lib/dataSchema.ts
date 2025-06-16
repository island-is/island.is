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
} from './schemas'
import { familyInformationSchema } from './schemas/familyInformationSchema'

const FileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})

const currentJobSchema = z.object({
  employer: z
    .object({
      nationalId: z.string().optional(),
      name: z.string().optional(),
    })
    .optional(),
  percentage: z.string().optional(),
  startDate: z.string().optional(),
  workHours: z.string().optional(),
  salary: z.string().optional(),
  endDate: z.string().optional(),
})

const currentSituationSchema = z.object({
  status: z.string().optional(),
  currentJob: currentJobSchema.optional(),
  wantedJobPercentage: z.string().optional(),
  jobTimelineStartDate: z.string().optional(),
})

/**  Job search section  **/
const jobWishesSchema = z.object({
  jobList: z.array(z.string()).optional(),
  outsideYourLocation: z
    .nativeEnum(YesOrNoEnum)
    .refine((v) => Object.values(YesOrNoEnum).includes(v)),
  location: z.array(z.string()).optional(),
})

const currentStudiesSchema = z
  .object({
    schoolName: z.string(),
    courseSubject: z.string(),
    units: z.string(),
    degree: z.string(),
    expectedEndOfStudy: z.string(),
  })
  .optional()

const educationHistorySchema = z
  .object({
    levelOfStudy: z.string(),
    degree: z.string(),
    courseOfStudy: z.string(),
    studyNotCompleted: z.array(z.string()).optional(),
  })
  .optional()

const drivingLicenseSchema = z.object({
  drivingLicenseType: z.array(z.string()).optional(),
  heavyMachineryLicenses: z.array(z.string()).optional(),
})

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

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  applicant: applicantInformationSchema,
  familyInformation: familyInformationSchema,
  currentSituation: currentSituationSchema,
  currentStudies: currentStudiesSchema,
  educationHistory: z.array(educationHistorySchema),
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

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
