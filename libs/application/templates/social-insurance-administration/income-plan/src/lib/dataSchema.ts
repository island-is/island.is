import { coreErrorMessages } from '@island.is/application/core'
import { z } from 'zod'
import { INCOME, ISK, RatioType, YES } from './constants'
import { errorMessages } from './messages'

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  incomePlanTable: z
    .array(
      z
        .object({
          incomeCategory: z.string(),
          incomeType: z.string().min(1),
          income: z.enum([RatioType.YEARLY, RatioType.MONTHLY]),
          incomePerYear: z.string().optional(),
          equalIncomePerMonth: z.string().optional(),
          equalForeignIncomePerMonth: z.string().optional(),
          currency: z.string().min(1),
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
          ({ income, incomePerYear }) =>
            income === RatioType.YEARLY
              ? !!incomePerYear && Number(incomePerYear) > 0
              : true,
          {
            path: ['incomePerYear'],
          },
        )
        .refine(
          ({
            income,
            currency,
            equalIncomePerMonth,
            unevenIncomePerYear,
            incomeCategory,
          }) => {
            const unevenAndEmploymentIncome =
              unevenIncomePerYear?.[0] !== YES ||
              (incomeCategory !== INCOME && unevenIncomePerYear?.[0] === YES)

            return income === RatioType.MONTHLY &&
              currency === ISK &&
              unevenAndEmploymentIncome
              ? !!equalIncomePerMonth && Number(equalIncomePerMonth) > 0
              : true
          },
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
            incomeCategory,
          }) => {
            const unevenAndEmploymentIncome =
              unevenIncomePerYear?.[0] !== YES ||
              (incomeCategory !== INCOME && unevenIncomePerYear?.[0] === YES)

            return income === RatioType.MONTHLY &&
              currency !== ISK &&
              unevenAndEmploymentIncome
              ? !!equalForeignIncomePerMonth &&
                  Number(equalForeignIncomePerMonth) > 0
              : true
          },
          {
            path: ['equalForeignIncomePerMonth'],
          },
        )
        .refine(
          (incomePlanTable) =>
            incomePlanTable.income === RatioType.MONTHLY &&
            incomePlanTable?.incomeCategory === INCOME &&
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
        )
        .superRefine((incomePlanTable, ctx) => {
          if (
            incomePlanTable.income === RatioType.MONTHLY &&
            incomePlanTable?.incomeCategory === INCOME &&
            incomePlanTable.unevenIncomePerYear?.[0] === YES
          ) {
            if (
              incomePlanTable.january &&
              !(Number(incomePlanTable.january) > 0)
            ) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['january'],
                params: coreErrorMessages.defaultError,
              })
            }
            if (
              incomePlanTable.february &&
              !(Number(incomePlanTable.february) > 0)
            ) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['february'],
                params: coreErrorMessages.defaultError,
              })
            }
            if (incomePlanTable.march && !(Number(incomePlanTable.march) > 0)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['march'],
                params: coreErrorMessages.defaultError,
              })
            }
            if (incomePlanTable.april && !(Number(incomePlanTable.april) > 0)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['april'],
                params: coreErrorMessages.defaultError,
              })
            }
            if (incomePlanTable.may && !(Number(incomePlanTable.may) > 0)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['may'],
                params: coreErrorMessages.defaultError,
              })
            }
            if (incomePlanTable.june && !(Number(incomePlanTable.june) > 0)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['june'],
                params: coreErrorMessages.defaultError,
              })
            }
            if (incomePlanTable.july && !(Number(incomePlanTable.july) > 0)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['july'],
                params: coreErrorMessages.defaultError,
              })
            }
            if (
              incomePlanTable.august &&
              !(Number(incomePlanTable.august) > 0)
            ) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['august'],
                params: coreErrorMessages.defaultError,
              })
            }
            if (
              incomePlanTable.september &&
              !(Number(incomePlanTable.september) > 0)
            ) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['september'],
                params: coreErrorMessages.defaultError,
              })
            }
            if (
              incomePlanTable.october &&
              !(Number(incomePlanTable.october) > 0)
            ) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['october'],
                params: coreErrorMessages.defaultError,
              })
            }
            if (
              incomePlanTable.november &&
              !(Number(incomePlanTable.november) > 0)
            ) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['november'],
                params: coreErrorMessages.defaultError,
              })
            }
            if (
              incomePlanTable.december &&
              !(Number(incomePlanTable.december) > 0)
            ) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['december'],
                params: coreErrorMessages.defaultError,
              })
            }
          }
        }),
    )
    .refine((i) => i === undefined || i.length > 0, {
      params: errorMessages.incomePlanRequired,
    }),
})

export type SchemaFormValues = z.infer<typeof dataSchema>
