import { z } from 'zod'
import * as kennitala from 'kennitala'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

import {
  MANUAL,
  SPOUSE,
  TransferRightsOption,
  PARENTAL_GRANT,
  PARENTAL_GRANT_STUDENTS,
  PARENTAL_LEAVE,
  SINGLE,
  PERMANENT_FOSTER_CARE,
  OTHER_NO_CHILDREN_FOUND,
  ADOPTION,
  NO_PRIVATE_PENSION_FUND,
  NO_UNION,
  NO_UNEMPLOYED_BENEFITS,
  Languages,
} from '../constants'
import { errorMessages } from './messages'
import { formatBankInfo } from './parentalLeaveUtils'
import { yearFosterCareOrAdoption, yearInMonths } from '../config'
import { coreErrorMessages, NO, YES } from '@island.is/application/core'
import { defaultMultipleBirthsMonths } from '../config'

const PersonalAllowance = z
  .object({
    usePersonalAllowance: z.enum([YES, NO]),
    usage: z.string().optional(),
    useAsMuchAsPossible: z.enum([YES, NO]).optional(),
  })
  .refine(
    ({ usePersonalAllowance, useAsMuchAsPossible }) =>
      usePersonalAllowance === YES ? !!useAsMuchAsPossible : true,
    {
      path: ['useAsMuchAsPossible'],
    },
  )
  .refine(
    ({ usePersonalAllowance, usage, useAsMuchAsPossible }) =>
      usePersonalAllowance === YES && useAsMuchAsPossible === NO
        ? usage
          ? parseFloat(usage) >= 1 && parseFloat(usage) <= 100
          : false
        : true,
    {
      path: ['usage'],
    },
  )

const FileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})

/**
 * Both periods and employers objects had been removed from here, and the logic has
 * been moved to the answerValidators because it needs to be more advanced than
 * what zod can handle.
 */
export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  selectedChild: z.string().min(1),
  applicationType: z.object({
    option: z.enum([PARENTAL_GRANT, PARENTAL_GRANT_STUDENTS, PARENTAL_LEAVE]),
  }),
  noChildrenFound: z.object({
    typeOfApplication: z.enum([
      PERMANENT_FOSTER_CARE,
      ADOPTION,
      OTHER_NO_CHILDREN_FOUND,
    ]),
  }),
  fosterCareOrAdoption: z.object({
    birthDate: z.string().refine(
      (p) => {
        const birthDateDob = new Date(p)
        const today = new Date()
        const minimumStartDate = new Date(
          today.setMonth(
            today.getMonth() - yearFosterCareOrAdoption * yearInMonths,
          ),
        )

        return birthDateDob >= minimumStartDate
      },
      { params: errorMessages.fosterCare },
    ),
    adoptionDate: z.string(),
  }),
  noPrimaryParent: z.object({
    questionOne: z.enum([YES, NO]),
    questionTwo: z.enum([YES, NO]),
    questionThree: z.enum([YES, NO]),
    birthDate: z.string(),
  }),
  applicant: z.object({
    email: z.string().email(),
    phoneNumber: z.string().refine(
      (p) => {
        const phoneNumber = parsePhoneNumberFromString(p, 'IS')
        const phoneNumberStartStr = ['6', '7', '8']
        return (
          phoneNumber &&
          phoneNumber.isValid() &&
          phoneNumberStartStr.some((substr) =>
            phoneNumber.nationalNumber.startsWith(substr),
          )
        )
      },
      { params: errorMessages.phoneNumber },
    ),
    language: z.enum([Languages.IS, Languages.EN]),
  }),
  personalAllowance: PersonalAllowance,
  personalAllowanceFromSpouse: PersonalAllowance,
  payments: z
    .object({
      bank: z.string().refine(
        (b) => {
          const bankAccount = formatBankInfo(b)
          return bankAccount.length === 12 // 4 (bank) + 2 (ledger) + 6 (number)
        },
        { params: errorMessages.bank },
      ),
      useUnion: z.enum([YES, NO]).optional(),
      usePrivatePensionFund: z.enum([YES, NO]).optional(),
      pensionFund: z.string().optional(),
      privatePensionFund: z.string().optional(),
      privatePensionFundPercentage: z.enum(['0', '2', '4', '']).optional(),
      union: z.string().optional(),
    })
    .refine((p) => ('pensionFund' in p ? !!p.pensionFund : true), {
      path: ['pensionFund'],
      params: coreErrorMessages.missingAnswer,
    })
    .refine(
      ({ useUnion, union }) =>
        useUnion === YES ? !!union && union !== NO_UNION : true,
      {
        path: ['union'],
        params: coreErrorMessages.missingAnswer,
      },
    )
    .refine(
      ({ usePrivatePensionFund, privatePensionFund }) =>
        usePrivatePensionFund === YES
          ? !!privatePensionFund &&
            privatePensionFund !== NO_PRIVATE_PENSION_FUND
          : true,
      {
        path: ['privatePensionFund'],
        params: coreErrorMessages.missingAnswer,
      },
    )
    .refine(
      ({ usePrivatePensionFund, privatePensionFundPercentage }) =>
        usePrivatePensionFund === YES
          ? !!privatePensionFundPercentage &&
            privatePensionFundPercentage !== '0'
          : true,
      {
        path: ['privatePensionFundPercentage'],
        params: coreErrorMessages.missingAnswer,
      },
    ),
  shareInformationWithOtherParent: z.enum([YES, NO]),
  // We don't have away to validate companyId yet because isCompany return false on personal business ID
  employerNationalRegistryId: z.string().refine((n) => kennitala.isValid(n), {
    params: errorMessages.employerNationalRegistryId,
  }),
  employerPhoneNumber: z
    .string()
    .refine(
      (p) => {
        const phoneNumber = parsePhoneNumberFromString(p, 'IS')
        const phoneNumberStartStr = ['6', '7', '8']
        if (phoneNumber)
          return (
            phoneNumber.isValid() &&
            phoneNumberStartStr.some((substr) =>
              phoneNumber.nationalNumber.startsWith(substr),
            )
          )
        else return true
      },
      { params: errorMessages.phoneNumber },
    )
    .optional(),
  employment: z
    .object({
      isSelfEmployed: z.enum([YES, NO]),
      isReceivingUnemploymentBenefits: z.enum([YES, NO]).optional(),
      unemploymentBenefits: z.string().optional(),
    })
    .refine(
      ({ isSelfEmployed, isReceivingUnemploymentBenefits }) =>
        isSelfEmployed === NO ? !!isReceivingUnemploymentBenefits : true,
      { path: ['isReceivingUnemploymentBenefits'] },
    )
    .refine(
      ({
        isSelfEmployed,
        isReceivingUnemploymentBenefits,
        unemploymentBenefits,
      }) =>
        isSelfEmployed === NO && isReceivingUnemploymentBenefits === YES
          ? !!unemploymentBenefits &&
            unemploymentBenefits !== NO_UNEMPLOYED_BENEFITS
          : true,
      { path: ['unemploymentBenefits'] },
    ),
  employerLastSixMonths: z.enum([YES, NO]),
  requestRights: z.object({
    isRequestingRights: z.enum([YES, NO]),
    requestDays: z
      .string()
      .refine((v) => !isNaN(Number(v)))
      .optional(),
  }),
  giveRights: z
    .object({
      isGivingRights: z.enum([YES, NO]),
      giveDays: z
        .string()
        .refine((v) => !isNaN(Number(v)))
        .optional(),
    })
    .optional(),
  transferRights: z.enum([
    TransferRightsOption.REQUEST,
    TransferRightsOption.GIVE,
    TransferRightsOption.NONE,
  ]),
  otherParentObj: z
    .object({
      chooseOtherParent: z.enum([SPOUSE, NO, MANUAL, SINGLE]),
      otherParentName: z.string().optional(),
      otherParentId: z
        .string()
        .optional()
        .refine((n) => !n || (kennitala.isValid(n) && kennitala.isPerson(n)), {
          params: errorMessages.otherParentId,
        }),
    })
    .refine(
      ({ chooseOtherParent, otherParentId }) =>
        chooseOtherParent === MANUAL ? !!otherParentId : true,
      {
        params: coreErrorMessages.missingAnswer,
        path: ['otherParentId'],
      },
    )
    .optional(),
  otherParent: z.enum([SPOUSE, NO, MANUAL, SINGLE]).optional(),
  otherParentName: z.string().optional(),
  otherParentId: z
    .string()
    .optional()
    .refine((n) => !n || (kennitala.isValid(n) && kennitala.isPerson(n)), {
      params: errorMessages.otherParentId,
    }),
  otherParentRightOfAccess: z.enum([YES, NO]),
  otherParentEmail: z.string().email().optional(),
  otherParentPhoneNumber: z
    .string()
    .refine(
      (p) => {
        const phoneNumber = parsePhoneNumberFromString(p, 'IS')
        const phoneNumberStartStr = ['6', '7', '8']
        if (phoneNumber)
          return (
            phoneNumber.isValid() &&
            phoneNumberStartStr.some((substr) =>
              phoneNumber.nationalNumber.startsWith(substr),
            )
          )
        else return true
      },
      { params: errorMessages.phoneNumber },
    )
    .optional(),
  multipleBirths: z
    .object({
      hasMultipleBirths: z.enum([YES, NO]),
      multipleBirths: z.string().optional(),
    })
    .refine(
      ({ hasMultipleBirths, multipleBirths }) =>
        hasMultipleBirths === YES ? !!multipleBirths : true,
      {
        path: ['multipleBirths'],
        params: errorMessages.missingMultipleBirthsAnswer,
      },
    )
    .refine(
      ({ hasMultipleBirths, multipleBirths }) =>
        hasMultipleBirths === YES && multipleBirths
          ? Number(multipleBirths) >= 2
          : true,
      {
        path: ['multipleBirths'],
        params: errorMessages.tooFewMultipleBirthsAnswer,
      },
    )
    .refine(
      ({ hasMultipleBirths, multipleBirths }) =>
        hasMultipleBirths === YES && multipleBirths
          ? Number(multipleBirths) <= defaultMultipleBirthsMonths + 1
          : true,
      {
        path: ['multipleBirths'],
        params: errorMessages.tooManyMultipleBirthsAnswer,
      },
    ),
  addEmployer: z.enum([YES, NO]),
  addPeriods: z.enum([YES, NO]),
  fileUpload: z.object({
    studentFile: z
      .array(FileSchema)
      .optional()
      .refine((a) => a === undefined || a.length > 0, {
        params: errorMessages.requiredAttachment,
      }),
    singleParent: z
      .array(FileSchema)
      .optional()
      .refine((a) => a === undefined || a.length > 0, {
        params: errorMessages.requiredAttachment,
      }),
    parentWithoutBirthParent: z
      .array(FileSchema)
      .optional()
      .refine((a) => a === undefined || a.length > 0, {
        params: errorMessages.requiredAttachment,
      }),
    permanentFosterCare: z
      .array(FileSchema)
      .optional()
      .refine((a) => a === undefined || a.length > 0, {
        params: errorMessages.requiredAttachment,
      }),
    adoption: z
      .array(FileSchema)
      .optional()
      .refine((a) => a === undefined || a.length > 0, {
        params: errorMessages.requiredAttachment,
      }),
    employmentTerminationCertificateFile: z
      .array(FileSchema)
      .optional()
      .refine((a) => a === undefined || a.length > 0, {
        params: errorMessages.requiredAttachment,
      }),
    benefitsFile: z
      .array(FileSchema)
      .optional()
      .refine((a) => a === undefined || a.length > 0, {
        params: errorMessages.requiredAttachment,
      }),
    additionalDocuments: z
      .array(FileSchema)
      .optional()
      .refine((a) => a === undefined || a.length > 0, {
        params: errorMessages.requiredAttachment,
      }),
  }),
  employers: z
    .array(
      z
        .object({
          email: z
            .string()
            .email()
            .refine((x) => x.trim().length > 0, {
              params: errorMessages.employerEmail,
            }),
          phoneNumber: z
            .string()
            .refine(
              (p) => {
                const phoneNumber = parsePhoneNumberFromString(p, 'IS')
                const phoneNumberStartStr = ['6', '7', '8']
                if (phoneNumber)
                  return (
                    phoneNumber.isValid() &&
                    phoneNumberStartStr.some((substr) =>
                      phoneNumber.nationalNumber.startsWith(substr),
                    )
                  )
                else return true
              },
              { params: errorMessages.phoneNumber },
            )
            .optional(),
          ratio: z.string(),
          stillEmployed: z.enum([YES, NO]).optional(),
        })
        .refine((e) => ('stillEmployed' in e ? !!e.stillEmployed : true), {
          path: ['stillEmployed'],
        }),
    )
    .refine((e) => e === undefined || e.length > 0, {
      params: errorMessages.employersRequired,
    }),
})

export type SchemaFormValues = z.infer<typeof dataSchema>
