import { applicantInformationSchema } from '@island.is/application/ui-forms'
import { z } from 'zod'
import { errors } from './messages'
import { NO, YES } from '@island.is/application/types'

export const GrindavikHousingBuyoutSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  applicant: applicantInformationSchema(),
  additionalOwners: z
    .array(
      z.object({
        name: z
          .string()
          .or(z.undefined())
          .refine((v) => !!v, { params: errors.fields.required }),
        nationalId: z
          .string()
          .or(z.undefined())
          .refine((v) => !!v, { params: errors.fields.required }),
        email: z
          .string()
          .email()
          .or(z.undefined())
          .refine((v) => !!v, { params: errors.fields.required }),
        phone: z
          .string()
          .length(11)
          .or(z.undefined())
          .refine((v) => !!v, { params: errors.fields.required }),
      }),
    )
    .optional(),
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
  userConfirmation: z
    .array(z.enum([YES]))
    .refine((v) => v.includes(YES), { params: errors.fields.requiredCheckbox }),
})

export type GrindavikHousingBuyout = z.TypeOf<
  typeof GrindavikHousingBuyoutSchema
>
