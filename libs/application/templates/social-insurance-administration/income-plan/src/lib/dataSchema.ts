import { z } from 'zod'
import { RatioType } from './constants'

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  incomePlanTable: z.array(
    z
      .object({
        incomeCategories: z.string(),
        incomeTypes: z.string(),
        income: z.enum([RatioType.YEARLY, RatioType.MONTHLY]),
        incomePerYear: z.string().optional(),
        equalIncomePerMonth: z.string().optional(),
        currency: z.string(),
      })
      .refine(
        ({ income, incomePerYear }) =>
          income === RatioType.YEARLY ? !!incomePerYear : true,
        {
          path: ['incomePerYear'],
        },
      )
      .refine(
        ({ income, equalIncomePerMonth }) =>
          income === RatioType.MONTHLY ? !!equalIncomePerMonth : true,
        {
          path: ['equalIncomePerMonth'],
        },
      ),
  ),
})

export type SchemaFormValues = z.infer<typeof dataSchema>
