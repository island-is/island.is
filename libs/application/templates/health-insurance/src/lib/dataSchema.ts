import { applicantInformationSchema } from '@island.is/application/ui-forms'
import * as z from 'zod'
import { YesNo } from '../shared/constants'

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  status: z.object({
    type: z.enum(['employed', 'student', 'pensioner', 'other']),
  }),
  applicant: applicantInformationSchema(),
  citizenship: z.string().optional(),
  formerInsurance: z.object({
    registration: z.nativeEnum(YesNo),
    country: z.string().min(1),
    personalId: z.string().min(1),
    institution: z.string().min(1),
    entitlementReason: z.string().optional(),
  }),
  children: z.nativeEnum(YesNo),
  hasAdditionalInfo: z.nativeEnum(YesNo),
  additionalRemarks: z.string().optional(),
  confirmCorrectInfo: z.boolean().refine((v) => v),
})
