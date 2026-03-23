import { NO, YES } from '@island.is/application/core'
import {
  INCOME,
  ISK,
  RatioType,
  TaxLevelOptions,
} from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import { errorMessages as coreSIAErrorMessages } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { z } from 'zod'
import { NOT_APPLICABLE, OTHER } from '../utils/constants'
import { errorMessages } from './messages'

const isValidPhoneNumber = (phoneNumber: string) => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone && phone.isValid()
}

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  applicantInfo: z.object({
    email: z.string().email().min(1),
    phonenumber: z.string().refine((v) => isValidPhoneNumber(v), {
      params: coreSIAErrorMessages.phoneNumber,
    }),
  }),
  paymentInfo: z
    .object({
      bank: z.object({
        bankNumber: z.string().regex(/^\d{4}$/),
        ledger: z.string().regex(/^\d{2}$/),
        accountNumber: z.string().regex(/^\d{6}$/),
      }),
      personalAllowance: z.enum([YES, NO]),
      personalAllowanceUsage: z.coerce
        .number()
        .int()
        .min(1)
        .max(100)
        .optional(),
      taxLevel: z.nativeEnum(TaxLevelOptions),
    })
    .refine(
      ({ personalAllowance, personalAllowanceUsage }) =>
        personalAllowance === YES ? !!personalAllowanceUsage : true,
      { path: ['personalAllowanceUsage'] },
    ),
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
            params: coreSIAErrorMessages.incomePlanMonthsRequired,
          },
        ),
    )
    .refine((i) => i === undefined || i.length > 0, {
      params: coreSIAErrorMessages.incomePlanRequired,
    }),
  benefitsFromAnotherCountry: z
    .object({
      isReceivingBenefitsFromAnotherCountry: z.enum([YES, NO]),
      countries: z
        .array(
          z.object({
            country: z.string().optional().nullable(),
            nationalId: z.string().optional(),
          }),
        )
        .optional(),
    })
    .superRefine(
      ({ isReceivingBenefitsFromAnotherCountry, countries }, ctx) => {
        if (isReceivingBenefitsFromAnotherCountry === YES) {
          // Validate that at least one country has been provided
          if (!countries || countries.length === 0) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              params: errorMessages.countriesRequired,
              path: ['countries'],
            })
            return // Stop further validation since the array is required
          }

          countries.forEach(({ country, nationalId }, index) => {
            // Validate that a country is selected
            if (!country) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                params: errorMessages.countryRequired,
                path: ['countries', index, 'country'],
              })
            }

            // Validate that nationalId is not empty
            if (!nationalId) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                params: errorMessages.countryIdNumberRequired,
                path: ['countries', index, 'nationalId'],
              })
            }

            // Validate that nationalId is at least 5 characters or symbols
            if (nationalId && nationalId.length < 5) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                params: errorMessages.countryIdNumberMin,
                path: ['countries', index, 'nationalId'],
              })
            }
          })
        }
      },
    ),
  questions: z
    .object({
      isSelfEmployed: z.enum([YES, NO]).optional(),
      isPartTimeEmployed: z.enum([YES, NO]),
      isStudying: z.enum([YES, NO]),
      calculatedRemunerationDate: z.string().optional(),
      educationalInstitution: z.string().optional().nullable(),
      ectsUnits: z.string().optional().nullable(),
    })
    .refine(
      ({ isSelfEmployed, calculatedRemunerationDate }) =>
        isSelfEmployed === YES ? !!calculatedRemunerationDate : true,
      {
        path: ['calculatedRemunerationDate'],
        params: errorMessages.dateRequired,
      },
    )
    .refine(
      ({ isStudying, educationalInstitution }) =>
        isStudying === YES ? !!educationalInstitution : true,
      {
        path: ['educationalInstitution'],
      },
    )
    .refine(
      ({ isStudying, ectsUnits }) => (isStudying === YES ? !!ectsUnits : true),
      {
        path: ['ectsUnits'],
      },
    ),
  employeeSickPay: z
    .object({
      hasUtilizedEmployeeSickPayRights: z.enum([YES, NO, NOT_APPLICABLE]),
      endDate: z.string().optional(),
    })
    .refine(
      ({ hasUtilizedEmployeeSickPayRights, endDate }) =>
        hasUtilizedEmployeeSickPayRights === YES ||
        hasUtilizedEmployeeSickPayRights === NO
          ? !!endDate
          : true,
      {
        path: ['endDate'],
        params: errorMessages.dateRequired,
      },
    ),
  unionSickPay: z
    .object({
      hasUtilizedUnionSickPayRights: z.string().optional().nullable(),
      unionInfo: z.string().optional().nullable(),
      endDate: z.string().optional().nullable(),
      unionName: z.string().optional().nullable(),
    })
    .refine(
      ({ hasUtilizedUnionSickPayRights, unionName }) => {
        // If the union name is set then we don't need to check the hasUtilizedUnionSickPayRights
        if (unionName) {
          return true
        }

        return !!hasUtilizedUnionSickPayRights
      },
      {
        path: ['hasUtilizedUnionSickPayRights'],
      },
    )
    .refine(
      ({ hasUtilizedUnionSickPayRights, unionInfo, unionName }) => {
        // If the union name is set then we don't need to check the union
        if (unionName) {
          return true
        }

        return hasUtilizedUnionSickPayRights !== NOT_APPLICABLE
          ? !!unionInfo
          : true
      },
      {
        path: ['unionInfo'],
      },
    )
    .refine(
      ({ hasUtilizedUnionSickPayRights, endDate }) =>
        hasUtilizedUnionSickPayRights !== NOT_APPLICABLE ? !!endDate : true,
      {
        path: ['endDate'],
        params: errorMessages.dateRequired,
      },
    ),
  rehabilitationPlan: z.object({
    confirmation: z.array(z.string()).refine((v) => v.includes(YES)),
  }),
  confirmedTreatment: z.object({
    confirmation: z.array(z.string()).refine((v) => v.includes(YES)),
  }),
  confirmationOfPendingResolution: z.object({
    confirmation: z.array(z.string()).refine((v) => v.includes(YES)),
  }),
  confirmationOfIllHealth: z.object({
    confirmation: z.array(z.string()).refine((v) => v.includes(YES)),
  }),
  selfAssessmentQuestionsOne: z.object({
    hadAssistance: z.enum([YES, NO]).optional(),
    educationalLevel: z.string().min(1),
  }),
  selfAssessmentQuestionsTwo: z
    .object({
      currentEmploymentStatuses: z.array(z.string()).min(1).optional(),
      currentEmploymentStatusExplanation: z.string().optional(),
      lastProfession: z.string().optional().nullable(),
      lastProfessionDescription: z.string().optional(),
      lastActivityOfProfession: z.string().optional().nullable(),
      lastActivityOfProfessionDescription: z.string().optional(),
      lastProfessionYear: z.string().optional().nullable(),
    })
    .refine(
      ({ currentEmploymentStatuses, currentEmploymentStatusExplanation }) =>
        Array.isArray(currentEmploymentStatuses) &&
        currentEmploymentStatuses.includes(OTHER)
          ? !!currentEmploymentStatusExplanation?.trim()
          : true,
      { path: ['currentEmploymentStatusExplanation'] },
    )
    .refine(
      ({ lastProfession, lastProfessionDescription }) =>
        lastProfession && lastProfession === OTHER
          ? !!lastProfessionDescription?.trim()
          : true,
      { path: ['lastProfessionDescription'] },
    )
    .refine(
      ({ lastActivityOfProfession, lastActivityOfProfessionDescription }) =>
        lastActivityOfProfession && lastActivityOfProfession === OTHER
          ? !!lastActivityOfProfessionDescription?.trim()
          : true,
      { path: ['lastActivityOfProfessionDescription'] },
    ),
  selfAssessmentQuestionsThree: z
    .object({
      mainProblem: z.string().min(1).optional(),
      hasPreviouslyReceivedRehabilitationOrTreatment: z
        .enum([YES, NO])
        .optional(),
      previousRehabilitationOrTreatment: z.string().optional(),
      previousRehabilitationSuccessful: z.string().optional(),
      previousRehabilitationSuccessfulFurtherExplanations: z
        .string()
        .optional(),
    })
    .refine(
      ({
        hasPreviouslyReceivedRehabilitationOrTreatment,
        previousRehabilitationOrTreatment,
      }) =>
        hasPreviouslyReceivedRehabilitationOrTreatment === YES
          ? !!previousRehabilitationOrTreatment
          : true,
      { path: ['previousRehabilitationOrTreatment'] },
    )
    .refine(
      ({
        hasPreviouslyReceivedRehabilitationOrTreatment,
        previousRehabilitationSuccessful,
      }) =>
        hasPreviouslyReceivedRehabilitationOrTreatment === YES
          ? !!previousRehabilitationSuccessful
          : true,
      { path: ['previousRehabilitationSuccessful'] },
    )
    .refine(
      ({
        hasPreviouslyReceivedRehabilitationOrTreatment,
        previousRehabilitationSuccessful,
        previousRehabilitationSuccessfulFurtherExplanations,
      }) =>
        hasPreviouslyReceivedRehabilitationOrTreatment === YES &&
        (previousRehabilitationSuccessful === YES ||
          previousRehabilitationSuccessful === NO)
          ? !!previousRehabilitationSuccessfulFurtherExplanations
          : true,
      { path: ['previousRehabilitationSuccessfulFurtherExplanations'] },
    ),
  selfAssessment: z.object({
    questionnaire: z
      .array(
        z.object({
          answer: z
            .string()
            .min(1)
            .refine((v) => !!v && v.trim().length > 0, {
              params: errorMessages.selfAssessmentQuestionnaireRequired,
            }),
          questionId: z.string(),
        }),
      )
      .optional(),
  }),
})

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
