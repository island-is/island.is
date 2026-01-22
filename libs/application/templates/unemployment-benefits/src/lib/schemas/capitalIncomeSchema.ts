import { YesOrNoEnum } from '@island.is/application/core'
import { z } from 'zod'

export const capitalIncomeSchema = z
  .object({
    otherIncome: z
      .nativeEnum(YesOrNoEnum)
      .refine((v) => Object.values(YesOrNoEnum).includes(v)),
    capitalIncomeAmount: z
      .array(
        z.object({
          amount: z.string().optional(),
        }),
      )
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.otherIncome === YesOrNoEnum.YES) {
      data.capitalIncomeAmount?.forEach((item, index) => {
        if (!item.amount) {
          ctx.addIssue({
            path: ['capitalIncomeAmount', index, 'amount'],
            code: z.ZodIssueCode.custom,
          })
        }
      })
    }
  })
