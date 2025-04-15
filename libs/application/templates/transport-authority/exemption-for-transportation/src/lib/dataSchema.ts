import { z } from 'zod'
import { applicantInformationSchema } from '@island.is/application/ui-forms'
import * as kennitala from 'kennitala'

export const ExemptionForTransportationSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  applicant: applicantInformationSchema({
    phoneRequired: true,
    emailRequired: true,
  }).refine(({ nationalId }) => kennitala.isValid(nationalId)),
})

export type ExemptionForTransportation = z.TypeOf<
  typeof ExemptionForTransportationSchema
>
