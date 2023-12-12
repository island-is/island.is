import { z } from 'zod'
import * as kennitala from 'kennitala'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

import {
  NO,
  YES,
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
} from '../constants'
import { errorMessages } from './messages'
import { formatBankInfo } from './parentalLeaveUtils'
import { yearFosterCareOrAdoption, yearInMonths } from '../config'

const PersonalAllowance = z
  .object({
    usePersonalAllowance: z.enum([YES, NO]),
    usage: z
      .string()
      .refine((x) => parseFloat(x) >= 1 && parseFloat(x) <= 100)
      .optional(),
    useAsMuchAsPossible: z.enum([YES, NO]).optional(),
  })
  .refine(
    (schema) =>
      schema.usePersonalAllowance === YES ? !!schema.useAsMuchAsPossible : true,
    {
      path: ['useAsMuchAsPossible'],
    },
  )

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
  }),
  personalAllowance: PersonalAllowance,
  personalAllowanceFromSpouse: PersonalAllowance,
  payments: z.object({
    bank: z.string().refine(
      (b) => {
        const bankAccount = formatBankInfo(b)
        return bankAccount.length === 12 // 4 (bank) + 2 (ledger) + 6 (number)
      },
      { params: errorMessages.bank },
    ),
    pensionFund: z.string().optional(),
    privatePensionFund: z.string().optional(),
    privatePensionFundPercentage: z.enum(['0', '2', '4', '']).optional(),
    union: z.string().optional(),
  }),
  shareInformationWithOtherParent: z.enum([YES, NO]),
  useUnion: z.enum([YES, NO]),
  usePrivatePensionFund: z.enum([YES, NO]),
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
  isSelfEmployed: z.enum([YES, NO]),
  isReceivingUnemploymentBenefits: z.enum([YES, NO]),
  isRecivingUnemploymentBenefits: z.enum([YES, NO]),
  unemploymentBenefits: z.string().min(1),
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
  multipleBirths: z.object({
    hasMultipleBirths: z.enum([YES, NO]),
    multipleBirths: z
      .string()
      .refine((v) => !isNaN(Number(v)))
      .optional(),
  }),
  addEmployer: z.enum([YES, NO]),
  addPeriods: z.enum([YES, NO]),
})

export type SchemaFormValues = z.infer<typeof dataSchema>
