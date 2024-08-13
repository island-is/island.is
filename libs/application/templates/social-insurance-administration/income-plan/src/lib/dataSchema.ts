import { z } from 'zod'
import { ISK, RatioType } from './constants'
import { errorMessages } from './messages'

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  incomePlanTable: z
    .array(
      z
        .object({
          incomeCategories: z.string(),
          incomeTypes: z.string(),
          income: z.enum([RatioType.YEARLY, RatioType.MONTHLY]),
          incomePerYear: z.string().optional(),
          equalIncomePerMonth: z.string().optional(),
          equalForeignIncomePerMonth: z.string().optional(),
          currency: z.string(),
        })
        .refine(
          ({ income, currency, incomePerYear }) =>
            income === RatioType.YEARLY && currency === ISK
              ? !!incomePerYear
              : true,
          {
            path: ['incomePerYear'],
          },
        )
        .refine(
          ({ income, currency, equalIncomePerMonth }) =>
            income === RatioType.MONTHLY && currency === ISK
              ? !!equalIncomePerMonth
              : true,
          {
            path: ['equalIncomePerMonth'],
          },
        )
        .refine(
          ({ income, currency, equalForeignIncomePerMonth }) =>
            income === RatioType.MONTHLY && currency !== ISK
              ? !!equalForeignIncomePerMonth
              : true,
          {
            path: ['equalForeignIncomePerMonth'],
          },
        ),
    )
    .refine((i) => i === undefined || i.length > 0, {
      params: errorMessages.incomePlanRequired,
    }),
})

export type SchemaFormValues = z.infer<typeof dataSchema>
