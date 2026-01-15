import { z } from 'zod'
import { FileSchema } from './fileSchema'
import { YesOrNoEnum } from '@island.is/application/core'
import { PaymentTypeIds } from '../../shared/constants'

export const otherBenefitsSchema = z
  .object({
    receivingBenefits: z
      .nativeEnum(YesOrNoEnum)
      .refine((v) => Object.values(YesOrNoEnum).includes(v)),
    payments: z
      .array(
        z.object({
          typeOfPayment: z.preprocess((val) => {
            if (!val) {
              return ''
            }
            return val
          }, z.string()),
          subType: z
            .preprocess((val) => {
              if (!val) {
                return ''
              }
              return val
            }, z.string())
            .optional(),
          paymentAmount: z.string().optional(),
          privatePensionFund: z.string().optional(),
          pensionFund: z.string().optional(),
          union: z.string().optional(),
          dateFrom: z.string().optional(),
          dateTo: z.string().optional(),
          sicknessAllowanceFile: z.array(FileSchema).optional(),
          paymentPlanFile: z.array(FileSchema).optional(),
        }),
      )
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.receivingBenefits === YesOrNoEnum.YES) {
      data.payments?.forEach((payment, index) => {
        if (
          payment.typeOfPayment === PaymentTypeIds.SICKNESS_PAYMENTS_TYPE_ID
        ) {
          if (!payment.dateFrom) {
            ctx.addIssue({
              path: ['payments', index, 'dateFrom'],
              code: z.ZodIssueCode.custom,
            })
          }
          if (!payment.dateTo) {
            ctx.addIssue({
              path: ['payments', index, 'dateTo'],
              code: z.ZodIssueCode.custom,
            })
          }
        }

        if (
          payment.typeOfPayment === PaymentTypeIds.SUPPLEMENTARY_FUND_TYPE_ID
        ) {
          if (!payment.privatePensionFund) {
            ctx.addIssue({
              path: ['payments', index, 'privatePensionFund'],
              code: z.ZodIssueCode.custom,
            })
          }

          if (!payment.paymentAmount) {
            ctx.addIssue({
              path: ['payments', index, 'paymentAmount'],
              code: z.ZodIssueCode.custom,
            })
          }
        }

        if (payment.typeOfPayment === PaymentTypeIds.PENSION_FUND_TYPE_ID) {
          if (!payment.pensionFund) {
            ctx.addIssue({
              path: ['payments', index, 'pensionFund'],
              code: z.ZodIssueCode.custom,
            })
          }
          if (
            payment.subType !== PaymentTypeIds.SPOUSE_PENSION &&
            !payment.paymentAmount
          ) {
            ctx.addIssue({
              path: ['payments', index, 'paymentAmount'],
              code: z.ZodIssueCode.custom,
            })
          }
        }

        if (
          payment.typeOfPayment === PaymentTypeIds.SICKNESS_PAYMENTS_TYPE_ID &&
          !payment.union
        ) {
          ctx.addIssue({
            path: ['payments', index, 'union'],
            code: z.ZodIssueCode.custom,
          })
        }

        if (
          payment.typeOfPayment === PaymentTypeIds.INSURANCE_PAYMENTS_TYPE_ID
        ) {
          if (
            payment.subType !== PaymentTypeIds.REHAB_PENSION_ID &&
            !payment.paymentAmount
          ) {
            ctx.addIssue({
              path: ['payments', index, 'paymentAmount'],
              code: z.ZodIssueCode.custom,
            })
          }
        }
      })
    }
  })
