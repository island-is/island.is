import { applicantInformationSchema } from '@island.is/application/ui-forms'
import { z } from 'zod'
import { errors } from './messages'
import { OTHER_PROVIDER, PreemptiveRight } from './constants'
import { NO, YES } from '@island.is/application/core'

const required = { params: errors.fields.required }

export const GrindavikHousingBuyoutSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  applicant: applicantInformationSchema(),
  applicantBankInfo: z
    .string()
    .refine((v) => !!v && v.length === 12, { params: errors.fields.bankInfo }),
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
        bankInfo: z.string().refine((v) => !!v && v.length === 12, {
          params: errors.fields.bankInfo,
        }),
      }),
    )
    .optional(),
  deliveryDate: z
    .string()
    .min(1)
    .refine((v) => !!v && v.trim().length > 0, required),
  loanProviders: z
    .object({
      loans: z
        .array(
          z
            .object({
              status: z
                .string()
                .or(z.undefined())
                .refine((v) => !!v, required),
              provider: z
                .string()
                .or(z.undefined())
                .refine((v) => !!v, required),
              otherProvider: z.string().or(z.undefined()),
            })
            .superRefine((v, ctx) => {
              /**
               * If the user has selected that they have loans from other providers
               * we need to make sure that the otherProvider field is filled out
               */
              if (v.provider === OTHER_PROVIDER && !v.otherProvider) {
                return ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  path: ['otherProvider'],
                  params: errors.fields.required,
                })
              }
            }),
        )
        .optional(),
      hasNoLoans: z.array(z.enum([YES])),
    })
    .superRefine((v, ctx) => {
      /**
       * If no loans are added and the user has not selected that
       * they have loans from other providers we need to show a
       * custom error message
       */
      if ((!v.loans || v.loans.length === 0) && !v.hasNoLoans?.includes(YES)) {
        return ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['hasNoLoans'],
          params: errors.fields.otherLoanProviders,
        })
      }
    }),
  confirmLoanTakeover: z.array(z.enum([YES])),
  preemptiveRight: z
    .object({
      preemptiveRightWish: z
        .string(z.enum([YES, NO]))
        .refine((v) => !!v, required),
      preemptiveRightType: z
        .array(
          z.enum([
            PreemptiveRight.PURCHASE_RIGHT,
            PreemptiveRight.PRE_PURCHASE_RIGHT,
            PreemptiveRight.PRE_LEASE_RIGHT,
          ]),
        )
        .optional(),
    })
    .superRefine((v, ctx) => {
      /**
       * If the user has selected that they want to use their preemptive right
       * we need to make sure that the preemptiveRightType field is filled out
       */
      if (
        v.preemptiveRightWish === YES &&
        (!v.preemptiveRightType || v.preemptiveRightType.length === 0)
      ) {
        return ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['preemptiveRightType'],
          params: errors.fields.preemptiveRightType,
        })
      }
    }),
})

export type GrindavikHousingBuyout = z.TypeOf<
  typeof GrindavikHousingBuyoutSchema
>
