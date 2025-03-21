import { z } from 'zod'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import * as kennitala from 'kennitala'
import { coreErrorMessages } from '@island.is/application/core/messages'
import { m } from './messages'
import { EMAIL_REGEX, NO, YES } from '@island.is/application/core'

const isValidEmail = (value: string) => EMAIL_REGEX.test(value)

const isValidPhoneNumber = (phoneNumber: string) => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone && phone.isValid()
}

const individualInfo = z.object({
  person: z.object({
    nationalId: z.string().refine((x) => (x ? kennitala.isPerson(x) : false)),
    name: z.string().refine((v) => v),
  }),
  phone: z.string().refine((v) => isValidPhoneNumber(v)),
  email: z.string().refine((v) => isValidEmail(v)),
  hasBirthCertificate: z.boolean().optional(),

  //Validators
  nationalIdValidatorApplicant: z.string().optional(),
  nationalIdValidatorSpouse: z.string().optional(),
  nationalIdValidatorWitness: z.string().optional(),
})

const individualInfoWithElectronicId = individualInfo.extend({
  electronicID: z.string().optional(),
})

const personalInfo = z.object({
  address: z.string().refine((v) => v),
  citizenship: z.string(),
  maritalStatus: z.string(),
})

export const dataSchema = z.object({
  //applicant's part of the application
  approveExternalData: z.boolean().refine((v) => v),
  applicant: individualInfo,
  spouse: individualInfoWithElectronicId.superRefine(
    ({ person, nationalIdValidatorApplicant, electronicID }, ctx) => {
      if (
        person.nationalId === nationalIdValidatorApplicant?.replace(/\D/g, '')
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: m.nationalIdDuplicateErrorSpouse.defaultMessage,
          path: ['person', 'nationalId'],
        })
      } else if (electronicID === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: m.phoneElectronicIdError.defaultMessage,
          path: ['phone'],
        })
      }
    },
  ),
  witness1: individualInfoWithElectronicId.superRefine(
    (
      {
        person,
        nationalIdValidatorApplicant,
        nationalIdValidatorSpouse,
        electronicID,
      },
      ctx,
    ) => {
      if (
        person.nationalId ===
          nationalIdValidatorApplicant?.replace(/\D/g, '') ||
        person.nationalId === nationalIdValidatorSpouse?.replace(/\D/g, '')
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            m.nationalIdDuplicateErrorMaritalSideVsWitness.defaultMessage,
          path: ['person', 'nationalId'],
        })
      } else if (electronicID === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: m.phoneElectronicIdError.defaultMessage,
          path: ['phone'],
        })
      }
    },
  ),
  witness2: individualInfoWithElectronicId.superRefine(
    (
      {
        person,
        nationalIdValidatorApplicant,
        nationalIdValidatorSpouse,
        nationalIdValidatorWitness,
        electronicID,
      },
      ctx,
    ) => {
      if (
        person.nationalId ===
          nationalIdValidatorApplicant?.replace(/\D/g, '') ||
        person.nationalId === nationalIdValidatorSpouse?.replace(/\D/g, '')
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            m.nationalIdDuplicateErrorMaritalSideVsWitness.defaultMessage,
          path: ['person', 'nationalId'],
        })
      } else if (
        person.nationalId === nationalIdValidatorWitness?.replace(/\D/g, '')
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: m.nationalIdDuplicateErrorWitness.defaultMessage,
          path: ['person', 'nationalId'],
        })
      } else if (electronicID === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: m.phoneElectronicIdError.defaultMessage,
          path: ['phone'],
        })
      }
    },
  ),
  personalInfo: personalInfo,
  spousePersonalInfo: personalInfo,
  ceremony: z
    .object({
      hasDate: z.string(),
      date: z.string(),
      period: z
        .object({
          dateFrom: z.string().optional(),
          dateTo: z.string().optional(),
        })
        .refine(
          ({ dateFrom, dateTo }) =>
            dateFrom && dateTo ? dateFrom <= dateTo : true,
          {
            message: m.tilBeforeFrom.defaultMessage,
            path: ['dateTo'],
          },
        ),
      place: z.object({
        ceremonyPlace: z.string().optional(),
        office: z.string().optional(),
        society: z.string().optional(),
      }),
    })
    .partial()
    .refine(
      ({ hasDate, period, date }) =>
        hasDate === YES
          ? (!!period?.dateFrom || !period?.dateFrom) &&
            (!!period?.dateTo || !period?.dateTo) &&
            !!date
          : true,
      {
        message: coreErrorMessages.defaultError.defaultMessage,
        path: ['date'],
      },
    )
    .refine(
      ({ hasDate, period, date }) =>
        hasDate === NO
          ? (!!date || !date) && !!period?.dateFrom && !!period.dateTo
          : true,
      {
        message: coreErrorMessages.defaultError.defaultMessage,
        path: ['period', 'dateFrom'],
      },
    )
    .refine(
      ({ hasDate, period, date }) =>
        hasDate === NO
          ? (!!date || !date) && !!period?.dateFrom && !!period.dateTo
          : true,
      {
        message: coreErrorMessages.defaultError.defaultMessage,
        path: ['period', 'dateTo'],
      },
    )
    .refine(({ hasDate }) => !!hasDate, {
      message: coreErrorMessages.defaultError.defaultMessage,
      path: ['hasDate'],
    })
    .refine(({ place }) => !!place?.ceremonyPlace, {
      message: coreErrorMessages.defaultError.defaultMessage,
      path: ['place', 'ceremonyPlace'],
    }),
  applicantConfirmMissingInfo: z.array(z.enum([YES])).length(1),
  spouseConfirmMissingInfo: z.array(z.enum([YES])).length(1),

  //spouse's part of the application
  spouseApprove: z.array(z.enum([YES, NO])).nonempty(),
  spouseApproveExternalData: z.boolean().refine((v) => v),
})
