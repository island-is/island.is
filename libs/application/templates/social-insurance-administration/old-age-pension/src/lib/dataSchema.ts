import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { z } from 'zod'
import {
  ApplicationType,
  Employment,
  RatioType,
  employeeRatio,
} from './constants'
import {
  formatBankInfo,
  validIBAN,
  validSWIFT,
} from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'
import { errorMessages } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import {
  BankAccountType,
  INCOME,
  ISK,
  TaxLevelOptions,
} from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import { validatorErrorMessages } from './messages'
import { filterValidEmployers } from './oldAgePensionUtils'
import { Employer } from '../types'
import { NO, YES } from '@island.is/application/core'

const getTotalRatio = (employers: Employer[]) => {
  return employers.reduce((accumulator, currentValue) => {
    if (
      currentValue.ratioType === RatioType.YEARLY &&
      currentValue?.ratioYearly
    ) {
      return accumulator + +currentValue?.ratioYearly
    } else if (
      currentValue.ratioType === RatioType.MONTHLY &&
      currentValue?.ratioMonthlyAvg
    ) {
      return accumulator + +currentValue.ratioMonthlyAvg
    }
    return accumulator
  }, 0)
}

const isValidPhoneNumber = (phoneNumber: string) => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone && phone.isValid()
}

const validateOptionalPhoneNumber = (value: string) => {
  return isValidPhoneNumber(value) || value === ''
}

const FileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  applicationType: z.object({
    option: z.enum([
      ApplicationType.OLD_AGE_PENSION,
      ApplicationType.HALF_OLD_AGE_PENSION,
      ApplicationType.SAILOR_PENSION,
    ]),
  }),
  questions: z.object({
    pensionFund: z.enum([YES, NO]),
  }),
  applicant: z.object({
    email: z.string().email().min(1),
    phoneNumber: z.string().refine((v) => validateOptionalPhoneNumber(v), {
      params: errorMessages.phoneNumber,
    }),
  }),
  incomePlanTable: z
    .array(
      z
        .object({
          incomeCategory: z.string(),
          incomeType: z.string().min(1),
          income: z.enum([RatioType.MONTHLY, RatioType.YEARLY]),
          incomePerYear: z.string().optional(),
          equalIncomePerMonth: z.string().optional(),
          equalForeignIncomePerMonth: z.string().optional(),
          unevenIncomePerYear: z.array(z.enum([YES]).optional()).optional(),
          currency: z.string().min(1),
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
  residenceHistory: z.object({
    question: z.enum([YES, NO]),
  }),
  period: z.object({
    year: z.string(),
    month: z.string(),
  }),
  onePaymentPerYear: z.object({
    question: z.enum([YES, NO]),
  }),
  fileUpload: z.object({
    fishermen: z
      .array(FileSchema)
      .optional()
      .refine((a) => a === undefined || a.length > 0, {
        params: errorMessages.requireAttachment,
      }),
    earlyRetirement: z
      .array(FileSchema)
      .optional()
      .refine((a) => a === undefined || a.length > 0, {
        params: errorMessages.requireAttachment,
      }),
  }),
  fileUploadAdditionalFilesRequired: z.object({
    additionalDocumentsRequired: z
      .array(FileSchema)
      .refine((a) => a.length !== 0, {
        params: errorMessages.requireAttachment,
      }),
  }),
  employment: z
    .object({
      status: z.enum([Employment.SELFEMPLOYED, Employment.EMPLOYEE]),
      selfEmployedAttachment: z.array(FileSchema),
    })
    .partial()
    .refine(
      ({ status, selfEmployedAttachment }) =>
        status === Employment.SELFEMPLOYED &&
        selfEmployedAttachment !== undefined
          ? selfEmployedAttachment.length !== 0
          : true,
      {
        params: errorMessages.requireAttachment,
        path: ['selfEmployedAttachment'],
      },
    ),
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
  employers: z
    .array(
      z
        .object({
          email: z
            .string()
            .email()
            .refine((x) => x.trim().length > 0, {
              params: validatorErrorMessages.employerEmailMissing,
            }),
          ratioType: z
            .enum([RatioType.MONTHLY, RatioType.YEARLY])
            .optional()
            .refine((x) => !!x, {
              params: validatorErrorMessages.employerRatioTypeMissing,
            }),
          phoneNumber: z
            .string()
            .refine((v) => validateOptionalPhoneNumber(v), {
              params: errorMessages.phoneNumber,
            }),
          ratioYearly: z.string().optional(),
          ratioMonthlyAvg: z.string().optional(),
        })
        .refine(
          ({ ratioType, ratioYearly }) =>
            ratioType === RatioType.YEARLY ? !!ratioYearly : true,
          {
            path: ['ratioYearly'],
            params: validatorErrorMessages.employerRatioMissing,
          },
        )
        .refine(
          ({ ratioType, ratioYearly }) =>
            ratioType === RatioType.YEARLY && !!ratioYearly
              ? Number(ratioYearly) <= employeeRatio
              : true,
          {
            path: ['ratioYearly'],
            params: validatorErrorMessages.employersRatioMoreThan50,
          },
        )
        .refine(
          ({ ratioType, ratioYearly }) =>
            ratioType === RatioType.YEARLY && !!ratioYearly
              ? Number(ratioYearly) > 0
              : true,
          {
            path: ['ratioYearly'],
            params: validatorErrorMessages.employersRatioLessThan0,
          },
        )
        .refine(
          ({ ratioType, ratioMonthlyAvg }) =>
            ratioType === RatioType.MONTHLY ? !!ratioMonthlyAvg : true,
          {
            path: ['ratioMonthlyAvg'],
            params: validatorErrorMessages.employerRatioMissing,
          },
        )
        .refine(
          ({ ratioType, ratioMonthlyAvg }) =>
            ratioType === RatioType.MONTHLY && !!ratioMonthlyAvg
              ? Number(ratioMonthlyAvg) <= employeeRatio
              : true,
          {
            path: ['ratioMonthlyAvg'],
            params: validatorErrorMessages.employersRatioMoreThan50,
          },
        )
        .refine(
          ({ ratioType, ratioMonthlyAvg }) =>
            ratioType === RatioType.MONTHLY && !!ratioMonthlyAvg
              ? Number(ratioMonthlyAvg) > 0
              : true,
          {
            path: ['ratioMonthlyAvg'],
            params: validatorErrorMessages.employersRatioLessThan0,
          },
        ),
    )
    .refine(
      (e) => {
        const index = e.length - 1
        if (index < 0) {
          return true
        }
        const employer = e[index]

        return e.findIndex((item) => item.email === employer.email) === index
      },
      (e) => ({
        params: validatorErrorMessages.employerEmailDuplicate,
        path: [`${e.length - 1}`, 'email'],
      }),
    )
    .refine(
      (e) => {
        const index = e.length - 1
        if (index < 0) {
          return true
        }
        const employer = e[index]
        const otherEmployers = e.slice(0, index)
        const validOtherEmployers = filterValidEmployers(otherEmployers)
        const totalRatio = getTotalRatio(validOtherEmployers)

        return employer.ratioType === RatioType.YEARLY && !!employer.ratioYearly
          ? Number(employer.ratioYearly) > employeeRatio
            ? true
            : Number(employer.ratioYearly) + totalRatio <= employeeRatio
          : true
      },
      (e) => ({
        params: validatorErrorMessages.totalEmployersRatioMoreThan50,
        path: [`${e.length - 1}`, 'ratioYearly'],
      }),
    )
    .refine(
      (e) => {
        const index = e.length - 1
        if (index < 0) {
          return true
        }
        const employer = e[index]
        const otherEmployers = e.slice(0, index)
        const validOtherEmployers = filterValidEmployers(otherEmployers)
        const totalRatio = getTotalRatio(validOtherEmployers)

        return employer.ratioType === RatioType.MONTHLY &&
          !!employer.ratioMonthlyAvg
          ? Number(employer.ratioMonthlyAvg) > employeeRatio
            ? true
            : Number(employer.ratioMonthlyAvg) + totalRatio <= employeeRatio
          : true
      },
      (e) => ({
        params: validatorErrorMessages.totalEmployersRatioMoreThan50,
        path: [`${e.length - 1}`, 'ratioMonthlyAvg'],
      }),
    ),
})

export type SchemaFormValues = z.infer<typeof dataSchema>
