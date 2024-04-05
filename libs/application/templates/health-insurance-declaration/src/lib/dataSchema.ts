import { applicantInformationSchema } from '@island.is/application/ui-forms'
import { z } from 'zod'

export const HealthInsuranceDeclarationSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  applicant: applicantInformationSchema(),
})

export type HealthInsuranceDeclaration = z.TypeOf<
  typeof HealthInsuranceDeclarationSchema
>
