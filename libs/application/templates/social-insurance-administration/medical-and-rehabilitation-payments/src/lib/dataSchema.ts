import { NO, YES } from '@island.is/application/core'
import { TaxLevelOptions } from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import { errorMessages as coreSIAErrorMessages } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { formatBankInfo } from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { z } from 'zod'
import { NOT_APPLICABLE } from './constants'
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
      bank: z.string(),
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
      ({ bank }) => {
        const bankAccount = formatBankInfo(bank ?? '')
        return bankAccount.length === 12 // 4 (bank) + 2 (ledger) + 6 (number)
      },
      { params: coreSIAErrorMessages.bank, path: ['bank'] },
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
        params: coreSIAErrorMessages.personalAllowance,
      },
    )
    .refine(
      ({ personalAllowance, personalAllowanceUsage }) =>
        personalAllowance === YES ? !!personalAllowanceUsage : true,
      { path: ['personalAllowanceUsage'] },
    ),
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
  selfAssessment: z.object({
    questionnaire: z.array(
      z.object({
        answer: z.string(),
        questionId: z.string(),
      }),
    ),
  }),
})

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
