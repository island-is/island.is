import { z } from 'zod'
import { ISK, RatioType, YES } from './constants'
import { errorMessages } from './messages'

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
        equalForeignIncomePerMonth: z.string().optional(),
        currency: z.string(),
        unevenIncomePerYear: z.array(z.enum([YES]).optional()).optional(),
        january: z.string().optional(),
        february: z.string().optional(),
        march: z.string().optional(),
        april: z.string().optional(),
        may: z.string().optional(),
        june: z.string().optional(),
        july: z.string().optional(),
        august: z.string().optional(),
        september: z.string().optional(),
        october: z.string().optional(),
        november: z.string().optional(),
        december: z.string().optional(),
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
        ({ income, currency, equalIncomePerMonth, unevenIncomePerYear }) =>
          income === RatioType.MONTHLY &&
          currency === ISK &&
          unevenIncomePerYear?.[0] !== YES
            ? !!equalIncomePerMonth
            : true,
        {
          path: ['equalIncomePerMonth'],
        },
      )
      .refine(
        ({
          income,
          currency,
          equalForeignIncomePerMonth,
          unevenIncomePerYear,
        }) =>
          income === RatioType.MONTHLY &&
          currency !== ISK &&
          unevenIncomePerYear?.[0] !== YES
            ? !!equalForeignIncomePerMonth
            : true,
        {
          path: ['equalForeignIncomePerMonth'],
        },
      )
      .refine(
        (incomePlanTable) =>
          incomePlanTable.income === RatioType.MONTHLY &&
          incomePlanTable.unevenIncomePerYear?.[0] === YES
            ? ![
                incomePlanTable.january,
                incomePlanTable.february,
                incomePlanTable.march,
                incomePlanTable.april,
                incomePlanTable.may,
                incomePlanTable.june,
                incomePlanTable.july,
                incomePlanTable.august,
                incomePlanTable.september,
                incomePlanTable.october,
                incomePlanTable.november,
                incomePlanTable.december,
              ].every((value) => value === undefined || value === '')
            : true,
        {
          path: ['incomePerYear'],
          params: errorMessages.monthsRequired,
        },
      ),
  ),
})

export type SchemaFormValues = z.infer<typeof dataSchema>
