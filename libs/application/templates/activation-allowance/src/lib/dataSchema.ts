import { z } from 'zod'
import * as kennitala from 'kennitala'
import { isValidPhoneNumber } from '../utils'
import { YesOrNoEnum } from '@island.is/application/core'

const applicantSchema = z
  .object({
    name: z.string().min(1),
    nationalId: z
      .string()
      .refine((nationalId) => nationalId && kennitala.isValid(nationalId)),
    address: z.string().min(1),
    postalCode: z.string().min(1),
    email: z.string().email(),
    phoneNumber: z.string().refine((v) => isValidPhoneNumber(v)),
    isSamePlaceOfResidence: z.array(z.string()).optional(),
    password: z.string().min(4),
    other: z
      .object({
        address: z.string().optional(),
        // postalCode: z.string().optional(),
        nationalAddress: z.string().optional(),
        email: z.string().optional(),
        phoneNumber: z.string().optional(),
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
  .refine(
    ({ isSamePlaceOfResidence, other }) => {
      if (isSamePlaceOfResidence?.length) {
        return (
          other && other.nationalAddress && other.nationalAddress.length > 0
        )
      }
      return true
    },
    {
      path: ['other', 'nationalAddress'],
    },
  )

const paymentInformationSchema = z.object({
  bankNumber: z.string().min(1),
  ledger: z.string().min(1),
  accountNumber: z.string().min(1),
})

const jobHistorySchema = z.object({
  company: z
    .object({
      name: z.string().optional(),
      nationalId: z.string().optional(),
    })
    .optional(),
  jobName: z.string().optional(),
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

export const ActivationAllowanceAnswersSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  approveTerms: z.array(z.string()).refine((v) => v.length > 0),
  applicant: applicantSchema,
  paymentInformation: paymentInformationSchema,
  jobHistory: z.array(jobHistorySchema),
  jobWishes: jobWishesSchema,
  academicBackground: academicBackgroundSchema,
})

export type ActivationAllowanceAnswers = z.TypeOf<
  typeof ActivationAllowanceAnswersSchema
>
