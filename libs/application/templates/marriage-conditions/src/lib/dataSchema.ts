import { z } from 'zod'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import * as kennitala from 'kennitala'
import { YES, NO, CeremonyPlaces } from './constants'
import { coreErrorMessages } from '@island.is/application/core/messages'
import { m } from './messages'

const emailRegex = /^[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%&'*+/=?`{|}~^-]+)*@(?:[A-Z0-9-]+\.)+[A-Z]{2,6}$/i
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
      withDate: z
        .object({
          date: z.string(),
          ceremonyPlace: z.string(),
          office: z.string(),
          society: z.string(),
        })
        .partial()
        .refine(({ date }) => !!date, {
          message: coreErrorMessages.defaultError.defaultMessage,
          path: ['date'],
        })
        .refine(({ ceremonyPlace }) => !!ceremonyPlace, {
          message: coreErrorMessages.defaultError.defaultMessage,
          path: ['ceremonyPlace'],
        })
        .refine(
          ({ ceremonyPlace, office }) =>
            ceremonyPlace === CeremonyPlaces.office ? !!office : true,
          {
            message: coreErrorMessages.defaultError.defaultMessage,
            path: ['office'],
          },
        )
        .refine(
          ({ ceremonyPlace, society }) =>
            ceremonyPlace === CeremonyPlaces.society ? !!society : true,
          {
            message: coreErrorMessages.defaultError.defaultMessage,
            path: ['society'],
          },
        ),
      withPeriod: z
        .object({
          dateFrom: z.string(),
          dateTil: z.string(),
        })
        .refine(
          ({ dateFrom, dateTil }) => new Date(dateFrom) <= new Date(dateTil),
          {
            message: m.tilBeforeFrom.defaultMessage,
            path: ['dateTil'],
          },
        ),
    })
    .partial()
    .refine(({ hasDate }) => !!hasDate, {
      message: coreErrorMessages.defaultError.defaultMessage,
      path: ['hasDate'],
    }),
  //spouse's part of the application
  spouseApprove: z.array(z.enum([YES, NO])).nonempty(),
  spouseApproveExternalData: z.boolean().refine((v) => v),
})
