import { z } from 'zod'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import * as kennitala from 'kennitala'
import { YES, NO } from './constants'
import { coreErrorMessages } from '@island.is/application/core/messages'
import { m } from './messages'

const emailRegex =
  /^[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%&'*+/=?`{|}~^-]+)*@(?:[A-Z0-9-]+\.)+[A-Z]{2,6}$/i
const isValidEmail = (value: string) => emailRegex.test(value)

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
  spouse: individualInfo,
  witness1: individualInfo,
  witness2: individualInfo,
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
  //spouse's part of the application
  spouseApprove: z.array(z.enum([YES, NO])).nonempty(),
  spouseApproveExternalData: z.boolean().refine((v) => v),
})
