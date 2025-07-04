import { z } from 'zod'
import * as kennitala from 'kennitala'
import { isValidPhoneNumber } from '../utils'
import { YesOrNoEnum } from '@island.is/application/core'

const FileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})

const applicantSchema = z
  .object({
    name: z.string().min(1),
    nationalId: z
      .string()
      .refine((nationalId) => nationalId && kennitala.isValid(nationalId)),
    address: z.string().min(1),
    //postalCode: z.string().min(1),
    city: z.string().min(1),
    //email: z.string().email(),
    //phoneNumber: z.string().refine((v) => isValidPhoneNumber(v)),
    isSamePlaceOfResidence: z.array(z.string()).optional(),
    password: z.string().min(4),
    other: z
      .object({
        address: z.string().optional(),
        postalCode: z.string().optional(),
      })
      .optional(),
  })
  .refine(
    ({ isSamePlaceOfResidence, other }) => {
      if (isSamePlaceOfResidence?.length) {
        return other && other.address && other.address.length > 0
      }
      return true
    },
    {
      path: ['other', 'address'],
    },
  )
// .refine(
//   ({ isSamePlaceOfResidence, other }) => {
//     if (isSamePlaceOfResidence?.length) {
//       return other && other.postalCode && other.postalCode.length > 0
//     }
//     return true
//   },
//   {
//     path: ['other', 'postalCode'],
//   },
// )

const paymentInformationSchema = z.object({
  bankNumber: z.string().regex(/^\d{4}$/),
  ledger: z.string().regex(/^\d{2}$/),
  accountNumber: z.string().regex(/^\d{6}$/),
})

const jobHistorySchema = z.object({
  companyName: z.string().optional(),
  jobName: z
    .string()
    .nullable()
    .transform((val) => (val === null ? undefined : val))
    .optional(),
  employmentRate: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

const jobWishesSchema = z.object({
  jobs: z.array(z.string()).optional(),
})

const academicBackgroundSchema = z.object({
  areYouStudying: z.nativeEnum(YesOrNoEnum),
  education: z
    .array(
      z.object({
        school: z.string().optional(),
        subject: z.string().optional(),
        units: z.string().optional(),
        degree: z.string().optional(),
        endOfStudies: z.string().optional(),
      }),
    )
    .optional(),
})

const drivingLicensesSchema = z.object({
  drivingLicenseType: z.array(z.string()).optional(),
  workMachineRights: z.array(z.string()).optional(),
})

const languageSkillsSchema = z.object({
  language: z.string().optional(),
  skills: z.string().optional(),
})

const cvSchema = z.object({
  haveCV: z.nativeEnum(YesOrNoEnum),
  cvFile: z.object({ file: z.array(FileSchema) }).optional(),
  other: z.string().optional(),
})

export const ActivationAllowanceAnswersSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  approveTerms: z.array(z.string()).refine((v) => v.length > 0),
  applicant: applicantSchema,
  paymentInformation: paymentInformationSchema,
  jobHistory: z.array(jobHistorySchema),
  jobWishes: jobWishesSchema,
  academicBackground: academicBackgroundSchema,
  drivingLicenses: drivingLicensesSchema,
  languageSkills: z.array(languageSkillsSchema),
  cv: cvSchema,
})

export type ActivationAllowanceAnswers = z.TypeOf<
  typeof ActivationAllowanceAnswersSchema
>
