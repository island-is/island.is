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
  .refine(
    ({ otherIncome, capitalIncomeAmount }) => {
      return otherIncome === YesOrNoEnum.YES
        ? !!capitalIncomeAmount &&
            capitalIncomeAmount.length > 0 &&
            capitalIncomeAmount.every((val) => !!val.amount)
        : true
    },
    {
      path: ['capitalIncomeAmount'],
    },
  )
