import { applicantInformationSchema } from '@island.is/application/ui-forms'
import { z } from 'zod'
import { errors } from './messages'
import { NO, YES } from '@island.is/application/types'

const required = { params: errors.fields.required }

export const GrindavikHousingBuyoutSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  applicant: applicantInformationSchema(),
  additionalOwners: z
    .array(
      z.object({
        name: z
          .string()
          .or(z.undefined())
          .refine((v) => !!v, required),
        nationalId: z
          .string()
          .or(z.undefined())
          .refine((v) => !!v, required),
        email: z
          .string()
          .email()
          .or(z.undefined())
          .refine((v) => !!v, required),
        phone: z
          .string()
          .length(11)
          .or(z.undefined())
          .refine((v) => !!v, required),
      }),
    )
    .optional(),
  loans: z
    .array(
      z.object({
        status: z
          .string()
          .or(z.undefined())
          .refine((v) => !!v, required),
        provider: z
          .string()
          .or(z.undefined())
          .refine((v) => !!v, required),
      }),
    )
    .optional(),
  confirmLoanTakeover: z.array(z.enum([YES])),
  preemptiveRightWish: z.array(z.enum([YES])),
  userConfirmation: z.array(z.enum([YES])),
})

export type GrindavikHousingBuyout = z.TypeOf<
  typeof GrindavikHousingBuyoutSchema
>
