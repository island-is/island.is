import { z } from 'zod'
import { FileSchema } from './fileSchema'
import { YesOrNoEnum } from '@island.is/application/core'

export const otherBenefitsSchema = z.object({
  paymentsFromInsurace: z.string().optional(),
  paymentsFromPension: z.array(
    z.object({
      typeOfPayment: z
        .preprocess((val) => {
          if (!val) {
            return ''
          }
          return val
        }, z.string())
        .optional(),
      paymentAmount: z.string().optional(),
    }),
  ),
  paymentsFromSicknessAllowance: z.object({
    union: z
      .preprocess((val) => {
        if (!val) {
          return ''
        }
        return val
      }, z.string())
      .optional(),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
    file: z.array(FileSchema).optional(),
  }),
  payedFromPrivatePensionFund: z
    .nativeEnum(YesOrNoEnum)
    .refine((v) => Object.values(YesOrNoEnum).includes(v)),
  payedFromPrivatePensionFundDetails: z
    .array(
      z.object({
        privatePensionFund: z
          .preprocess((val) => {
            if (!val) {
              return ''
            }
            return val
          }, z.string())
          .optional(),
        paymentAmount: z.string().optional(),
      }),
    )
    .optional(),
})
