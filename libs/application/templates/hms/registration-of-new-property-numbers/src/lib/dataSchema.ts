import { YES } from '@island.is/application/core'
import { z } from 'zod'
import { errorMessages } from './messages'
import { isValidEmail, isValidPhoneNumber } from '../utils/validations'

// Prerequisites
const readPrivacyPolicy = z.array(z.literal(YES)).length(1)
const readInfoCompliance = z.array(z.literal(YES)).length(1)

// Main form
const applicantSchema = z.object({
  email: z.string().refine((v) => !!v),
  name: z.string().refine((v) => !!v),
  nationalId: z.string().refine((v) => !!v),
  phoneNumber: z.string().refine((v) => !!v),
})

const contactSchema = z
  .object({
    isSameAsApplicant: z.array(z.string()).optional(),
    email: z.string().nullish().or(z.literal('')),
    name: z.string().nullish().or(z.literal('')),
    phone: z.string().nullish().or(z.literal('')),
  })
  .superRefine((val, ctx) => {
    const isSame = val.isSameAsApplicant?.includes(YES) ?? false

    if (!isSame) {
      if (!val.email || val.email.trim() === '' || !isValidEmail(val.email)) {
        ctx.addIssue({
          path: ['email'],
          code: z.ZodIssueCode.custom,
          params: errorMessages.emailNeeded,
        })
      }

      if (!val.name || val.name.trim() === '') {
        ctx.addIssue({
          path: ['name'],
          code: z.ZodIssueCode.custom,
          params: errorMessages.nameRequired,
        })
      }

      if (
        !val.phone ||
        val.phone.trim() === '' ||
        !isValidPhoneNumber(val.phone)
      ) {
        ctx.addIssue({
          path: ['phone'],
          code: z.ZodIssueCode.custom,
          params: errorMessages.phoneNumberRequired,
        })
      }
    }
  })

const realEstateSchema = z.object({
  realEstateName: z.string().refine((v) => !!v),
  realEstateAmount: z.string().refine((v) => {
    const num = Number(v)
    return !isNaN(num) && num >= 1 && num < 1000
  }),
  realEstateCost: z.string().refine((v) => !!v),
  realEstateOtherComments: z.string().max(200).optional(),
})

export const dataSchema = z.object({
  // Prerequisites
  confirmReadPrivacyPolicy: readPrivacyPolicy,
  confirmReadInfoCompliance: readInfoCompliance,
  approveExternalData: z.boolean().refine((v) => v),
  // Main form
  applicant: applicantSchema,
  contact: contactSchema,
  realEstate: realEstateSchema,
})

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
export type RealEstateAnswers = z.TypeOf<typeof realEstateSchema>
export type ContactAnswer = z.TypeOf<typeof contactSchema>
export type ApplicantAnswer = z.TypeOf<typeof applicantSchema>
