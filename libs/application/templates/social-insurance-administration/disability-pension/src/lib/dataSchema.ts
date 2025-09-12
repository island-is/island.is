import { NO, YES } from '@island.is/application/core'
import {
  BankAccountType,
  INCOME,
  ISK,
  RatioType,
  TaxLevelOptions,
} from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import { errorMessages } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import {
  validIBAN,
  validSWIFT,
} from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'
import { applicantInformationSchema } from '@island.is/application/ui-forms'
import { z } from 'zod'
import { disabilityPensionFormMessage } from './messages'

export const fileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})

const livedAbroadSchema = z.object({
  hasLivedAbroad: z.enum([YES, NO]),
  list: z
    .array(
      z.object({
        country: z.string(),
        abroadNationalId: z.string().min(4).optional().or(z.literal('')),
        periodStart: z.string(),
        periodEnd: z.string(),
        period: z.string(),
      }),
    )
    .optional(),
})

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  applicant: applicantInformationSchema({
    phoneRequired: true,
    phoneDisabled: false,
    phoneEnableCountrySelector: true,
    emailRequired: false,
    emailDisabled: true,
  }),
  applicantMaritalStatus: z.object({
    status: z.number(),
    spouseName: z.string().min(2).max(100).optional().or(z.literal('')),
    spouseNationalId: z.string().min(4).max(10).optional().or(z.literal('')),
  }),
  disabilityAppliedBefore: z.enum([YES, NO]),
  disabilityPeriod: z.object({
    year: z.preprocess((value) => {
      if (typeof value === 'string' && value !== '') {
        const number = Number.parseInt(value as string, 10)
        return isNaN(number) ? undefined : number
      }
    }, z.number()),
    month: z.preprocess((value) => {
      if (typeof value === 'string' && value !== '') {
        const number = Number.parseInt(value as string, 10)
        return isNaN(number) ? undefined : number
      }
    }, z.number()),
  }),
  livedAbroad: livedAbroadSchema.refine(
    ({ list, hasLivedAbroad }) => {
      if (hasLivedAbroad === NO || (list && list.length > 0)) {
        return true
      }
      return false
    },
    {
      path: ['list'],
      params: disabilityPensionFormMessage.errors.emptyForeignResidence,
    },
  ),
  paidWork: z
    .object({
      inPaidWork: z.enum([YES, NO]),
      continuedWork: z.enum([YES, NO]).optional(),
    })
    .refine(
      ({ inPaidWork, continuedWork }) => {
        if (inPaidWork === NO) {
          return continuedWork !== undefined
        }
        return true
      },
      {
        path: ['continuedWork'],
      },
    ),
  abroadPayments: z
    .object({
      hasAbroadPayments: z.enum([YES, NO]),
      list: z
        .array(
          z.object({
            country: z.string(),
            abroadNationalId: z.string().min(4).optional().or(z.literal('')),
          }),
        )
        .optional(),
    })
    .refine(
      ({ list, hasAbroadPayments }) => {
        if (hasAbroadPayments === NO || (list && list.length > 0)) {
          return true
        }
        return false
      },
      {
        path: ['list'],
        params: disabilityPensionFormMessage.errors.emptyForeignPayments,
      },
    ),
  backgroundInfoMaritalStatus: z.object({
    status: z.preprocess((value) => {
      if (typeof value === 'string' && value !== '') {
        const number = Number.parseInt(value as string, 10)
        return isNaN(number) ? undefined : number
      }
    }, z.number()),
  }),
  backgroundInfoResidence: z
    .object({
      status: z.preprocess((value) => {
        if (typeof value === 'string' && value !== '') {
          const number = Number.parseInt(value as string, 10)
          return isNaN(number) ? undefined : number
        }
      }, z.number()),
      other: z.string().optional(),
    })
    .refine(
      ({ status, other }) => {
        if (status === 6) {
          return other && other.length > 0
        }
        return true
      },
      {
        path: ['other'],
        params: disabilityPensionFormMessage.errors.emptyResidenceOtherText,
      },
    ),
  backgroundInfoChildren: z.object({
    count: z.string(),
  }),
  backgroundInfoIcelandicCapability: z.object({
    capability: z.preprocess((value) => {
      if (typeof value === 'string' && value !== '') {
        const number = Number.parseInt(value as string, 10)
        return isNaN(number) ? undefined : number
      }
    }, z.number()),
  }),
  backgroundInfoLanguage: z
    .object({
      language: z.string(),
      other: z.string().optional(),
    })
    .refine(
      ({ language, other }) => {
        if (language === 'other') {
          return other && other.length > 0
        }
        return true
      },
      {
        path: ['other'],
        params: disabilityPensionFormMessage.errors.emptyLanguageOtherText,
      },
    ),
  backgroundInfoEmployment: z
    .object({
      status: z.array(z.string()),
      other: z.string().optional(),
    })
    .refine(
      ({ status, other }) => {
        return (status && status.length > 0) || (other && other.length > 0)
      },
      {
        path: ['status'],
        params: disabilityPensionFormMessage.errors.emptyEmploymentStatus,
      },
    ),
  backgroundInfoPreviousEmployment: z
    .object({
      hasEmployment: z.enum([YES, NO]),
      when: z.preprocess((value) => {
        if (typeof value === 'string' && value !== '') {
          const number = Number.parseInt(value as string, 10)
          return isNaN(number) ? undefined : number
        }
      }, z.number().nullable().optional()),
      job: z.string().nullable().optional(),
      field: z.string().nullable().optional(),
    })
    .refine(
      ({ hasEmployment, when }) => {
        if (hasEmployment === YES) {
          return when && when > 0
        }
        return true
      },
      {
        path: ['when'],
        params: disabilityPensionFormMessage.errors.emptyPreviousEmploymentWhen,
      },
    )
    .refine(
      ({ hasEmployment, job }) => {
        if (hasEmployment === YES) {
          return job && job.length > 0
        }
        return true
      },
      {
        path: ['job'],
        params: disabilityPensionFormMessage.errors.emptyPreviousEmploymentJob,
      },
    )
    .refine(
      ({ hasEmployment, field }) => {
        if (hasEmployment === YES) {
          return field && field.length > 0
        }
        return true
      },
      {
        path: ['field'],
        params:
          disabilityPensionFormMessage.errors.emptyPreviousEmploymentField,
      },
    ),
  backgroundInfoEmploymentCapability: z
    .object({
      capability: z.preprocess((value) => {
        if (typeof value === 'string' && value !== '') {
          const number = Number.parseInt(value as string, 10)
          return isNaN(number) ? undefined : number
        }
      }, z.number({ required_error: 'capability must be a valid number' })),
    })
    .refine(
      ({ capability }) => {
        if (capability < 0 || capability > 100) {
          return false
        }
        return true
      },
      {
        path: ['capability'],
        params: disabilityPensionFormMessage.errors.capabilityBetween0And100,
      },
    ),
  backgroundInfoEmploymentImportance: z.object({
    importance: z.preprocess((value) => {
      if (typeof value === 'string' && value !== '') {
        const number = Number.parseInt(value as string, 10)
        return isNaN(number) ? undefined : number
      }
    }, z.number().min(0).max(4)),
  }),
  backgroundInfoRehabilitationOrTherapy: z
    .object({
      rehabilitationOrTherapy: z.enum([YES, NO]),
      rehabilitationDescription: z.string().optional(),
      rehabilitationResults: z.string().optional(),
    })
    .refine(
      ({ rehabilitationOrTherapy, rehabilitationDescription }) => {
        if (rehabilitationOrTherapy === YES) {
          return (
            rehabilitationDescription && rehabilitationDescription.length > 0
          )
        }
        return true
      },
      {
        path: ['rehabilitationDescription'],
        params:
          disabilityPensionFormMessage.errors
            .emptyRehabilitationOrTherapyDescription,
      },
    )
    .refine(
      ({ rehabilitationOrTherapy, rehabilitationResults }) => {
        if (rehabilitationOrTherapy === YES) {
          return rehabilitationResults && rehabilitationResults.length > 0
        }
        return true
      },
      {
        path: ['rehabilitationResults'],
        params:
          disabilityPensionFormMessage.errors.emptyRehabilitationOrTherapyProgress,
      },
    ),
  backgroundInfoBiggestIssue: z.object({
    text: z.string(),
  }),
  backgroundInfoEducationLevel: z.object({
    level: z.string(),
  }),
  paymentInfo: z
    .object({
      bankAccountType: z.nativeEnum(BankAccountType),
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
    .refine(({ bankAccountType }) => bankAccountType !== undefined, {
      params: errorMessages.bankAccountType,
      path: ['bankAccountType'],
    })
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
    .refine(({ personalAllowance }) => personalAllowance !== undefined, {
      params: errorMessages.personalAllowanceUse,
      path: ['personalAllowance'],
    })
    .refine(
      ({ personalAllowance, personalAllowanceUsage }) => {
        if (personalAllowance === YES) {
          const usage = Number(personalAllowanceUsage)
          return (
            personalAllowanceUsage !== undefined &&
            !Number.isNaN(usage) &&
            1 <= usage &&
            usage <= 100
          )
        }
        return true
      },
      {
        path: ['personalAllowanceUsage'],
        params: errorMessages.personalAllowance,
      },
    ),
  incomePlan: z
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
          (incomePlan) =>
            incomePlan.income === RatioType.MONTHLY &&
            incomePlan?.incomeCategory === INCOME &&
            incomePlan.unevenIncomePerYear?.[0] === YES
              ? ![
                  incomePlan.january,
                  incomePlan.february,
                  incomePlan.march,
                  incomePlan.april,
                  incomePlan.may,
                  incomePlan.june,
                  incomePlan.july,
                  incomePlan.august,
                  incomePlan.september,
                  incomePlan.october,
                  incomePlan.november,
                  incomePlan.december,
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
  selfEvaluationAssistance: z.object({
    assistance: z.enum([YES, NO]),
  }),
  questionAnswer: z.object({
    id: z.string(),
    answer: z.string(),
  }),
  capabilityImpairment: z.object({
    questionAnswers: z
      .array(
        z.object({
          id: z.string(),
          answer: z.string(),
        }),
      )
      .optional()
      .nullable(),
  }),
  extraInfo: z.string().optional(),
})

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
