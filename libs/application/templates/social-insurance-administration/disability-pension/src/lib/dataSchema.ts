import { z } from 'zod'
import { errorMessages } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { BankAccountType, INCOME, ISK, RatioType, TaxLevelOptions } from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import { NO, YES } from '@island.is/application/core'
import { formatBankInfo, validIBAN, validSWIFT } from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'
import { disabilityPensionFormMessage } from './messages'
import { EmploymentEnum, MaritalStatusEnum, ResidenceEnum, ChildrenCountEnum, IcelandicCapabilityEnum, LanguageEnum, EmploymentStatusEnum, EmploymentImportanceEnum } from '../types/enums'
import { OptionsValueEnum } from '../forms/mainForm/capabilityImpairmentSection/mockData'
import { applicantInformationSchema } from '@island.is/application/ui-forms'


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
      abroadNationalId: z.string().min(4),
      periodStart: z.string(),
      periodEnd: z.string(),
      period: z.string()
    })
  ).optional()
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
    status: z.nativeEnum(MaritalStatusEnum),
    spouseName: z.string().min(2).max(100).optional(),
    spouseNationalId: z.string().min(4).max(10).optional()
  }),
  disabilityEvaluation: z.object({
    appliedBefore: z.enum([YES, NO]).optional(),
    fileUpload: z.array(fileSchema).optional()
  }).optional(),
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
    inPaidWork: z.nativeEnum(EmploymentEnum),
    continuedWork: z.enum([YES, NO]).optional()
  }).refine(({inPaidWork, continuedWork}) => {
    if (inPaidWork === EmploymentEnum.YES) {
      return continuedWork !== undefined
    }
    return true
  }, {
  path: ['continuedWork'],
}),
  abroadPayments: z.object({
    hasAbroadPayments: z.enum([YES, NO]),
    list: z.array(
      z.object({
        country: z.string(),
        abroadNationalId: z.string().min(4),
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
    params: disabilityPensionFormMessage.errors.emptyForeignResidence,
  }),
  backgroundInfoMaritalStatus: z.object({
    status: z.nativeEnum(MaritalStatusEnum),
  }),
  backgroundInfoResidence: z.object({
    status: z.nativeEnum(ResidenceEnum),
    other: z.string().optional(),
  }).refine(
    ({ status, other }) => {
      if (status === ResidenceEnum.OTHER) {
        return other && other.length > 0
      }
      return true
    },
  ),
  backgroundInfoChildren: z.nativeEnum(ChildrenCountEnum),
  backgroundInfoIcelandicCapability: z.object({
    capability: z.nativeEnum(IcelandicCapabilityEnum),
  }),
  backgroundInfoLanguage: z.object({
    language: z.nativeEnum(LanguageEnum),
    other: z.string().optional(),
  }).refine(
    ({ language, other }) => {
      if (language === LanguageEnum.OTHER) {
        return other && other.length > 0
      }
      return true
    },
  ),
  backgroundInfoEmployment: z.object({
    status: z.array(z.nativeEnum(EmploymentStatusEnum)).optional(),
    other: z.string().optional(),
  }).refine(
    ({ status, other }) => {
      return (status && status.length > 0) || (other && other.length > 0)
    },
    {
      path: ['status'],
      params: disabilityPensionFormMessage.errors.emptyEmploymentStatus,
    }
  ),
  backgroundInfoPreviousEmployment: z.object({
    hasEmployment: z.enum([YES, NO]),
    when: z.string().optional(),
    field: z.string().optional(),
  }).refine(
    ({ hasEmployment, when }) => {
      if (hasEmployment === YES) {
        return when && when.length > 0
      }
      return true
    },
    {
      path: ['when'],
      params: disabilityPensionFormMessage.errors.emptyPreviousEmploymentWhen,
    }
  ).refine(
    ({ hasEmployment, field }) => {
      if (hasEmployment === YES) {
        return field && field.length > 0
      }
      return true
    },
    {
      path: ['field'],
      params: disabilityPensionFormMessage.errors.emptyPreviousEmploymentField,
    }
  ),
  backgroundInfoEmploymentCapability: z.object({
    capability: z.preprocess(
      (value) => {
        if (typeof value === 'string' && value !== "") {
          const number = Number.parseInt(value as string, 10);
          return isNaN(number) ? undefined : number
        }
      },
      z.number({ required_error: 'capability must be a valid number' })
    ),
  }).refine(
    ({ capability }) => {
      if (capability < 0 || capability > 100) {
        return false
      }
      return true
    },
    {
      path: ['capability'],
      params: disabilityPensionFormMessage.errors.capabilityBetween0And100,
    }
  ),
  backgroundInfoEmploymentImportance: z.object({
    importance: z.nativeEnum(EmploymentImportanceEnum),
  }),
  backgroundInfoRehabilitationOrTherapy: z.object({
    rehabilitationOrTherapy: z.enum([YES, NO]),
  }),
  backgroundInfoBiggestIssue: z.object({
    text: z.string(),
  }),
  backgroundInfoEducationLevel: z.object({
    level: z.string()
  }),
  paymentInfo: z
    .object({
      accountType: z.nativeEnum(BankAccountType),
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
      ({ bank, accountType }) => {
        if (accountType === BankAccountType.ICELANDIC) {
          const bankAccount = formatBankInfo(bank ?? '')
          return bankAccount.length === 12 // 4 (bank) + 2 (ledger) + 6 (number)
        }
        return true
      },
      { params: errorMessages.bank, path: ['bank'] },
    )
    .refine(
      ({ iban, accountType }) => {
        if (accountType === BankAccountType.FOREIGN) {
          const formattedIBAN = iban?.replace(/[\s]+/g, '')
          return formattedIBAN ? validIBAN(formattedIBAN) : false
        }
        return true
      },
      { params: errorMessages.iban, path: ['iban'] },
    )
    .refine(
      ({ swift, accountType }) => {
        if (accountType === BankAccountType.FOREIGN) {
          const formattedSWIFT = swift?.replace(/[\s]+/g, '')
          return formattedSWIFT ? validSWIFT(formattedSWIFT) : false
        }
        return true
      },
      { params: errorMessages.swift, path: ['swift'] },
    )
    .refine(
      ({ bankName, accountType }) =>
        accountType === BankAccountType.FOREIGN ? !!bankName : true,
      { path: ['bankName'] },
    )
    .refine(
      ({ bankAddress, accountType }) =>
        accountType === BankAccountType.FOREIGN ? !!bankAddress : true,
      { path: ['bankAddress'] },
    )
    .refine(
      ({ currency, accountType }) =>
        accountType === BankAccountType.FOREIGN ? !!currency : true,
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
  incomePlan: z.array(z
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
  selfEvaluation: z.object({
    assistance: z.enum([YES, NO]),
  }),
  capabilityImpairment: z.object({
    questionAnswers: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        answer: z.nativeEnum(OptionsValueEnum),
      })
    ),
  }),
})

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
