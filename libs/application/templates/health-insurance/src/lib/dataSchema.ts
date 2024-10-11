import { applicantInformationSchema } from '@island.is/application/ui-forms'
import * as z from 'zod'
import { EmploymentStatus, YesNo } from '../utils/constants'

const formerInsurance = z.object({
  registration: z.nativeEnum(YesNo),
  country: z.string().min(1),
  personalId: z.string().min(1),
  institution: z.string().min(1),
  entitlementReason: z.string().optional(),
})

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  applicant: applicantInformationSchema(),
  status: z.object({ type: z.nativeEnum(EmploymentStatus) }),
  children: z.nativeEnum(YesNo),
  citizenship: z.string().optional(),
  formerInsurance,
  hasAdditionalInfo: z.nativeEnum(YesNo),
  additionalRemarks: z.string().optional(),
  confirmCorrectInfo: z.boolean().refine((v) => v),
})
