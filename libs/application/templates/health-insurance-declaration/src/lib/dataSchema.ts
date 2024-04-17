import { applicantInformationSchema } from '@island.is/application/ui-forms'
import { z } from 'zod'

export const HealthInsuranceDeclarationSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  applicant: applicantInformationSchema(),
  isHealthInsured: z.boolean(),
  studentOrTravellerRadioFieldTraveller: z.string(),
  residencyTravellerRadioField: z.string(),
  registerPersonsSpouseCheckboxField: z.string().array(),
  registerPersonsChildrenCheckboxField: z.string().array(),
  dateFieldTo: z.string(),
  dateFieldFrom: z.string(),
})

export type HealthInsuranceDeclaration = z.TypeOf<
  typeof HealthInsuranceDeclarationSchema
>
