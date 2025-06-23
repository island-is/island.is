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
import { NOT_APPLICABLE } from '../utils/constants'
import { errorMessages } from './messages'

const isValidPhoneNumber = (phoneNumber: string) => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone && phone.isValid()
}

const FileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})

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
  questions: z
    .object({
      isSelfEmployed: z.enum([YES, NO]),
      isPartTimeEmployed: z.enum([YES, NO]),
      isStudying: z.enum([YES, NO]),
      calculatedRemunerationDate: z.string().optional(),
    })
    .refine(
      ({ isSelfEmployed, calculatedRemunerationDate }) =>
        isSelfEmployed === YES ? !!calculatedRemunerationDate : true,
      {
        path: ['calculatedRemunerationDate'],
        params: errorMessages.dateRequired,
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
      unionNationalId: z.string().optional().nullable(),
      endDate: z.string().optional().nullable(),
      fileupload: z.array(FileSchema).optional(),
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
      ({ hasUtilizedUnionSickPayRights, unionNationalId, unionName }) => {
        // If the union name is set then we don't need to check the union
        if (unionName) {
          return true
        }

        return hasUtilizedUnionSickPayRights !== NOT_APPLICABLE
          ? !!unionNationalId
          : true
      },
      {
        path: ['unionNationalId'],
      },
    )
    .refine(
      ({ hasUtilizedUnionSickPayRights, endDate }) =>
        hasUtilizedUnionSickPayRights !== NOT_APPLICABLE ? !!endDate : true,
      {
        path: ['endDate'],
        params: errorMessages.dateRequired,
      },
    )
    .refine(
      ({ hasUtilizedUnionSickPayRights, fileupload }) =>
        hasUtilizedUnionSickPayRights === YES && fileupload !== undefined
          ? fileupload.length !== 0
          : true,
      {
        path: ['fileupload'],
        params: coreSIAErrorMessages.requireAttachment,
      },
    ),
  rehabilitationPlanConfirmation: z
    .array(z.string())
    .refine((v) => v.includes(YES)),
  selfAssessment: z
    .object({
      hadAssistance: z.enum([YES, NO]).optional(),
      highestLevelOfEducation: z.string().optional(),
      mainProblem: z.string().min(1).optional(),
      hasPreviouslyReceivedRehabilitationOrTreatment: z
        .enum([YES, NO])
        .optional(),
      previousRehabilitationOrTreatment: z.string().optional(),
      previousRehabilitationSuccessful: z.string().optional(),
      previousRehabilitationSuccessfulFurtherExplanations: z
        .string()
        .optional(),
      questionnaire: z
        .array(
          z.object({
            answer: z.string(),
            questionId: z.string(),
          }),
        )
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
})

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
