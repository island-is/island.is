import { applicantInformationSchema } from '@island.is/application/ui-forms'
import { z } from 'zod'
import { errors } from './messages'

export const GrindavikHousingBuyoutSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  applicant: applicantInformationSchema(),
  loans: z
    .array(
      z.object({
        status: z
          .string()
          .or(z.undefined())
          .refine((v) => !!v, { params: errors.fields.required }),
        provider: z
          .string()
          .or(z.undefined())
          .refine((v) => !!v, { params: errors.fields.required }),
      }),
    )
    .optional(),
})

export type GrindavikHousingBuyout = z.TypeOf<
  typeof GrindavikHousingBuyoutSchema
>
