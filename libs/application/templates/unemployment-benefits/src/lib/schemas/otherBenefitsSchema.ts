import { z } from 'zod'
import { FileSchema } from './fileSchema'
import { YesOrNoEnum } from '@island.is/application/core'
import {
  INSURANCE_PAYMENTS_TYPE_ID,
  SICKNESS_PAYMENTS_TYPE_ID,
  SUPPLEMENTARY_FUND_TYPE_ID,
} from '../../shared/constants'

export const otherBenefitsSchema = z
  .object({
    receivingBenefits: z
      .nativeEnum(YesOrNoEnum)
      .refine((v) => Object.values(YesOrNoEnum).includes(v)),
    payments: z
      .array(
        z.object({
          typeOfPayment: z
            .preprocess((val) => {
              if (!val) {
                return ''
              }
              return val
            }, z.string())
            .optional(),
          subType: z
            .preprocess((val) => {
              if (!val) {
                return ''
              }
              return val
            }, z.string())
            .optional(),
          paymentAmount: z.string(),
          payer: z.string().optional(),
          dateFrom: z.string().optional(),
          dateTo: z.string().optional(),
          sicknessAllowanceFile: z.array(FileSchema).optional(),
          paymentPlanFile: z.array(FileSchema).optional(),
        }),
      )
      .optional(),
  })
  .superRefine((data, ctx) => {
    data.payments?.forEach((payment, index) => {
      if (payment.typeOfPayment === SICKNESS_PAYMENTS_TYPE_ID) {
        if (
          !(
            payment.sicknessAllowanceFile &&
            payment.sicknessAllowanceFile.length > 0
          )
        ) {
          ctx.addIssue({
            path: ['payments', index, 'sicknessAllowanceFile'],
            code: z.ZodIssueCode.custom,
          })
        }

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
        payment.typeOfPayment === SUPPLEMENTARY_FUND_TYPE_ID &&
        !payment.payer
      ) {
        ctx.addIssue({
          path: ['payments', index, 'payer'],
          code: z.ZodIssueCode.custom,
        })
      }

      if (
        payment.typeOfPayment === INSURANCE_PAYMENTS_TYPE_ID &&
        !(payment.paymentPlanFile && payment.paymentPlanFile.length > 0)
      ) {
        ctx.addIssue({
          path: ['payments', index, 'paymentPlanFile'],
          code: z.ZodIssueCode.custom,
        })
      }
    })
  })
