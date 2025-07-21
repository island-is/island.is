import { z } from 'zod'
import * as kennitala from 'kennitala'
import { isValidPhoneNumber } from '../utils'
import { YES, YesOrNoEnum } from '@island.is/application/core'
import { isValidEmail } from '../utils/isValidEmail'

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
    postalCode: z.string().optional(), //min(1),
    city: z.string().min(1),
    email: z.string().optional(), //.email(),
    phoneNumber: z.string().optional(), //refine((v) => isValidPhoneNumber(v)),
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
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

const jobWishesSchema = z.object({
  jobs: z.array(z.string()).optional(),
})

const academicBackgroundSchema = z.object({
  education: z
    .array(
      z.object({
        levelOfStudy: z.string().optional(),
        subject: z.string().optional(),
        degree: z.string().optional(),
        endOfStudies: z.string().optional(), // Transform if disabled
        isStillStudying: z.array(z.enum([YES])).optional(),
      }),
    )
    .optional(),
})

const drivingLicensesSchema = z.object({
  drivingLicenseType: z.array(z.string()).optional(),
  heavyMachineryLicenses: z.array(z.string()).optional(),
  hasDrivingLicense: z.array(z.enum([YES])).optional(),
  hasHeavyMachineryLicense: z.array(z.enum([YES])).optional(),
})

const languageSkillsSchema = z.object({
  icelandic: z.string(),
  english: z.string(),
  icelandicAbility: z.string(),
  englishAbility: z.string(),
  other: z.array(
    z.object({
      language: z.string().optional(),
      skills: z.string().optional(),
    }),
  ),
})

const cvSchema = z.object({
  haveCV: z.nativeEnum(YesOrNoEnum),
  cvFile: z.object({ file: z.array(FileSchema) }).optional(),
  other: z.string().optional(),
})

const contactSchema = z
  .object({
    isSameAsApplicant: z.array(z.enum([YES])).optional(),
    name: z.string().optional(),
    connection: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const isSame = !data.isSameAsApplicant?.includes(YES)

    if (isSame) {
      if (!data.name) {
        ctx.addIssue({
          path: ['name'],
          code: z.ZodIssueCode.custom,
        })
      }

      if (!data.connection) {
        ctx.addIssue({
          path: ['connection'],
          code: z.ZodIssueCode.custom,
        })
      }

      if (!data.email || !isValidEmail(data.email)) {
        ctx.addIssue({
          path: ['email'],
          code: z.ZodIssueCode.custom,
        })
      }

      if (!data.phone || !isValidPhoneNumber(data.phone)) {
        ctx.addIssue({
          path: ['phone'],
          code: z.ZodIssueCode.custom,
        })
      }
    }
  })

export const ActivationAllowanceAnswersSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  approveTerms: z.array(z.string()).refine((v) => v.length > 0),
  applicant: applicantSchema,
  contact: contactSchema,
  paymentInformation: paymentInformationSchema,
  jobHistory: z.array(jobHistorySchema),
  jobWishes: jobWishesSchema,
  academicBackground: academicBackgroundSchema,
  drivingLicenses: drivingLicensesSchema,
  languageSkills: languageSkillsSchema,
  cv: cvSchema,
})

export type ActivationAllowanceAnswers = z.TypeOf<
  typeof ActivationAllowanceAnswersSchema
>

export type JobHistoryAnswer = z.TypeOf<typeof jobHistorySchema>
export type EducationAnswer = z.TypeOf<typeof academicBackgroundSchema>
export type LanguageAnswers = z.TypeOf<typeof languageSkillsSchema>
export type ApplicantAnswer = z.TypeOf<typeof applicantSchema>
export type ContactAnswer = z.TypeOf<typeof contactSchema>
export type DrivingLicensesAnswer = z.TypeOf<typeof drivingLicensesSchema>
export type JobWishesAnswer = z.TypeOf<typeof jobWishesSchema>
export type PaymentInformationAnswer = z.TypeOf<typeof paymentInformationSchema>
