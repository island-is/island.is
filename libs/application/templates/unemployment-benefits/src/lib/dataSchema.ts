import { z } from 'zod'
import * as kennitala from 'kennitala'
import { NO, YES, YesOrNoEnum } from '@island.is/application/core'

const FileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})

const applicantInformationSchema = z
  .object({
    nationalId: z
      .string()
      .refine(
        (nationalId) =>
          nationalId &&
          nationalId.length !== 0 &&
          kennitala.isValid(nationalId),
      ),
    name: z.string(),
    address: z.string(),
    postalCode: z.string(),
    email: z.string(),
    phoneNumber: z.string(),
    password: z.string(),
    otherAddressCheckbox: z.array(z.string()).optional(),
    otherAddress: z.string().optional(),
    otherPostcode: z.string().optional(),
    serviceOffice: z.string().optional(),
  })
  .refine(
    ({ otherAddressCheckbox, otherAddress }) => {
      if (otherAddressCheckbox && otherAddressCheckbox[0] === YES) {
        return !!otherAddress
      }
      return true
    },
    {
      path: ['otherAddress'],
    },
  )
  .refine(
    ({ otherAddressCheckbox, otherPostcode }) => {
      if (otherAddressCheckbox && otherAddressCheckbox[0] === YES) {
        return !!otherPostcode
      }
      return true
    },
    {
      path: ['otherPostcode'],
    },
  )

const familyInformationSchema = z.object({
  children: z.array(
    z.object({
      name: z.string().min(1),
      nationalId: z.string().min(1),
    }),
  ),
  additionalChildren: z
    .array(
      z.object({
        name: z.string().optional(),
        nationalId: z.string().optional(),
      }),
    )
    .optional(),
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
  reasonForUnemployment: z.string().optional(),
  currentJob: currentJobSchema.optional(),
  wantedJobPercentage: z.string().optional(),
  jobTimelineStartDate: z.string().optional(),
})

/**  Job search section  **/
const jobWishesSchema = z.object({
  jobList: z.array(z.string()).optional(),
  outsideYourLocation: z.array(z.string()).optional(),
  location: z.array(z.string()).optional(),
})

const EmploymentHistorySchema = z.object({
  isIndependent: z
    .nativeEnum(YesOrNoEnum)
    .refine((v) => Object.values(YesOrNoEnum).includes(v)),
  lastJob: z.object({
    title: z.string().optional(),
    percentage: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }),
  workOnOwnSSN: z.nativeEnum(YesOrNoEnum).optional(),
  ownSSNJob: z.object({
    title: z.string().optional(),
    percentage: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }),
  previousJobs: z.array(
    z.object({
      company: z.object({
        nationalId: z.string().optional(),
        name: z.string().optional(),
      }),
      title: z.string().optional(),
      percentage: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    }),
  ),
  hasWorkedEes: z
    .nativeEnum(YesOrNoEnum)
    .refine((v) => Object.values(YesOrNoEnum).includes(v)),
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
  workMachineRights: z.array(z.string()).optional(),
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
  jobWishes: jobWishesSchema,
  currentStudies: currentStudiesSchema,
  educationHistory: z.array(educationHistorySchema),
  drivingLicense: drivingLicenseSchema,
  languageSkills: z.array(languageSkillsSchema),
  euresJobSearch: euresSchema,
  resume: resumeSchema,
  employmentHistory: EmploymentHistorySchema,
  informationChangeAgreement: z
    .array(z.string())
    .refine((v) => v.includes(YES)),
  introductoryMeeting: introductoryMeetingSchema,
  concurrentWorkAgreement: z.array(z.string()).refine((v) => v.includes(YES)),
  yourRightsAgreement: z.array(z.string()).refine((v) => v.includes(YES)),
  lossOfRightsAgreement: z.array(z.string()).refine((v) => v.includes(YES)),
  employmentSearchConfirmationAgreement: z
    .array(z.string())
    .refine((v) => v.includes(YES)),
  interviewAndMeetingAgreement: z
    .array(z.string())
    .refine((v) => v.includes(YES)),
  introductoryMeetingAgreement: z
    .array(z.string())
    .refine((v) => v.includes(YES)),
  unemploymentBenefitsPayoutAgreement: z
    .array(z.string())
    .refine((v) => v.includes(YES)),
  vacationsAndForeginWorkAgreement: z
    .array(z.string())
    .refine((v) => v.includes(YES)),
})

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
