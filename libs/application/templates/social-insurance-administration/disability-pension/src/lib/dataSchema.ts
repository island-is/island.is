import { z } from 'zod'
import { errorMessages } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { BankAccountType, INCOME, ISK, RatioType, TaxLevelOptions } from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import { NO, YES } from '@island.is/application/core'
import { formatBankInfo, validIBAN, validSWIFT } from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'
import { isValidPhoneNumber } from './utils'
import { EmploymentEnum } from './constants'
import { disabilityPensionFormMessage } from './messages'
import { selfEvaluationRoute } from '../forms/mainForm/selfEvaluationSection'

export const fileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})

const livedAbroadSchema = z.object({
  hasLivedAbroad: z.enum([YES, NO]),
  list: z.array(
    z.object({
      country: z.string(),
      abroadNationalId: z.string(),
      periodStart: z.string(),
      periodEnd: z.string(),
      period: z.string()
    })
  ).optional()
})

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  applicant: z.object({
    email: z.string().email().min(1),
    phoneNumber: z.string().refine((v) => isValidPhoneNumber(v), {
      params: errorMessages.phoneNumber,
    }),
  }),
  disabilityEvaluation: z.object({
    appliedBefore: z.enum([YES, NO]),
    fileUpload: z.array(fileSchema).optional()
  })
    .refine(
      ({ appliedBefore, fileUpload }) => {
        if (appliedBefore === YES) {
          return (fileUpload?.length ?? 0) > 0
        }
        else return true
      },
      { params: errorMessages.requireAttachment, path: ['fileUpload'] },
    ),
  livedAbroad: livedAbroadSchema
    .refine(({ list, hasLivedAbroad }) => {
      if ((hasLivedAbroad === NO) || (list && list.length > 0)) {
        return true
      }
      return false
    }, {
    path: ['list'],
    params: disabilityPensionFormMessage.errors.emptyForeignResidence,
  }),
  paidWork: z.object({
    inPaidWork: z.enum([EmploymentEnum.YES, EmploymentEnum.NO, EmploymentEnum.DONT_KNOW]),
    continuedWork: z.enum([YES, NO]).optional()
  }).refine(({inPaidWork, continuedWork}) => {
    if (inPaidWork === EmploymentEnum.YES) {
      return continuedWork !== undefined
    }
    return true
  }),
  abroadPayments: z.object({
    hasAbroadPayments: z.enum([YES, NO]),
    list: z.array(
      z.object({
        country: z.string(),
        abroadNationalId: z.string(),
      })
    ).optional()
  })
    .refine(({ list, hasAbroadPayments }) => {
      if ((hasAbroadPayments === NO) || (list && list.length > 0)) {
        return true
      }
      return false
    }, {
    path: ['list'],
    params: disabilityPensionFormMessage.errors.emptyForeignPayments,
  }),
  paymentInfo: z
    .object({
      bankAccountType: z.enum([
        BankAccountType.ICELANDIC,
        BankAccountType.FOREIGN,
      ]),
      bank: z.string(),
      bankAddress: z.string(),
      bankName: z.string(),
      currency: z.string().nullable(),
      iban: z.string(),
      swift: z.string(),
      personalAllowance: z.enum([YES, NO]),
      personalAllowanceUsage: z.string().optional(),
      taxLevel: z.enum([
        TaxLevelOptions.INCOME,
        TaxLevelOptions.FIRST_LEVEL,
        TaxLevelOptions.SECOND_LEVEL,
      ]),
    })
    .partial()
    .refine(
      ({ bank, bankAccountType }) => {
        if (bankAccountType === BankAccountType.ICELANDIC) {
          const bankAccount = formatBankInfo(bank ?? '')
          return bankAccount.length === 12 // 4 (bank) + 2 (ledger) + 6 (number)
        }
        return true
      },
      { params: errorMessages.bank, path: ['bank'] },
    )
    .refine(
      ({ iban, bankAccountType }) => {
        if (bankAccountType === BankAccountType.FOREIGN) {
          const formattedIBAN = iban?.replace(/[\s]+/g, '')
          return formattedIBAN ? validIBAN(formattedIBAN) : false
        }
        return true
      },
      { params: errorMessages.iban, path: ['iban'] },
    )
    .refine(
      ({ swift, bankAccountType }) => {
        if (bankAccountType === BankAccountType.FOREIGN) {
          const formattedSWIFT = swift?.replace(/[\s]+/g, '')
          return formattedSWIFT ? validSWIFT(formattedSWIFT) : false
        }
        return true
      },
      { params: errorMessages.swift, path: ['swift'] },
    )
    .refine(
      ({ bankName, bankAccountType }) =>
        bankAccountType === BankAccountType.FOREIGN ? !!bankName : true,
      { path: ['bankName'] },
    )
    .refine(
      ({ bankAddress, bankAccountType }) =>
        bankAccountType === BankAccountType.FOREIGN ? !!bankAddress : true,
      { path: ['bankAddress'] },
    )
    .refine(
      ({ currency, bankAccountType }) =>
        bankAccountType === BankAccountType.FOREIGN ? !!currency : true,
      { path: ['currency'] },
    )
    .refine(
      ({ personalAllowance, personalAllowanceUsage }) =>
        personalAllowance === YES
          ? !(
              Number(personalAllowanceUsage) < 1 ||
              Number(personalAllowanceUsage) > 100
            )
          : true,
      {
        path: ['personalAllowanceUsage'],
        params: errorMessages.personalAllowance,
      },
    )
    .refine(
      ({ personalAllowance, personalAllowanceUsage }) =>
        personalAllowance === YES ? !!personalAllowanceUsage : true,
      { path: ['personalAllowanceUsage'] },
    ),
  incomePlanTable: z.array(z
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
            income === RatioType.YEARLY ? !!incomePerYear : true,
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
              ? !!equalIncomePerMonth
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
              ? !!equalForeignIncomePerMonth
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
            params: errorMessages.incomePlanMonthsRequired,
          },
        ),
    )
    .refine((i) => i === undefined || i.length > 0, {
      params: errorMessages.incomePlanRequired,
    }),
  selfEvaluation: z.object({
    assistance: z.enum([YES, NO]),
  })
})

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
