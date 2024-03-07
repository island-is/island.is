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
  loanProviders: z
    .object({
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
      hasOtherLoanProvider: z.array(z.enum([YES])),
    })
    .superRefine((v, ctx) => {
      /**
       * If no loans are added and the user has not selected that
       * they have loans from other providers we need to show a
       * custom error message
       */
      if (
        (!v.loans || v.loans.length === 0) &&
        !v.hasOtherLoanProvider?.includes(YES)
      ) {
        return ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['hasOtherLoanProvider'],
          params: errors.fields.otherLoanProviders,
        })
      }
    }),
  confirmLoanTakeover: z.array(z.enum([YES])),
  preemptiveRightWish: z.string(z.enum([YES, NO])).refine((v) => !!v, required),
})

export type GrindavikHousingBuyout = z.TypeOf<
  typeof GrindavikHousingBuyoutSchema
>
