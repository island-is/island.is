import { YES } from '@island.is/application/core'
import { z } from 'zod'
import * as m from './messages'

const fileSchema = z.object({ key: z.string(), name: z.string() })

// Prerequisites
const readPrivacyPolicy = z.array(z.literal(YES)).length(1)
const readFireCompensationInfo = z.array(z.literal(YES)).length(1)

// Main form
const applicantSchema = z.object({
  address: z.string().refine((v) => !!v),
  city: z.string().refine((v) => !!v),
  email: z.string().refine((v) => !!v),
  name: z.string().refine((v) => !!v),
  nationalId: z.string().refine((v) => !!v),
  phoneNumber: z.string().refine((v) => !!v),
  postalCode: z.string().refine((v) => !!v),
})

const realEstateSchema = z.string()

const usageUnitsSchema = z.array(z.string()).min(1)

const appraisalMethodSchema = z.array(z.string()).min(1)

const descriptionSchema = z.string().min(1)

export const dataSchema = z.object({
  // Prerequisites
  confirmReadPrivacyPolicy: readPrivacyPolicy,
  confirmReadFireCompensationInfo: readFireCompensationInfo,
  approveExternalData: z.boolean().refine((v) => v),
  // Main form
  applicant: applicantSchema,
  realEstate: realEstateSchema,
  usageUnits: usageUnitsSchema,
  photos: z.array(fileSchema).superRefine((data, ctx) => {
    if (data.length < 3) {
      ctx.addIssue({
        params: m.photoMessages.alertMessage,
        code: z.ZodIssueCode.custom,
      })
    } else if (data.length > 10) {
      ctx.addIssue({
        params: m.photoMessages.maxPhotos,
        code: z.ZodIssueCode.custom,
      })
    }
  }),
  appraisalMethod: appraisalMethodSchema,
  description: descriptionSchema,
})

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
