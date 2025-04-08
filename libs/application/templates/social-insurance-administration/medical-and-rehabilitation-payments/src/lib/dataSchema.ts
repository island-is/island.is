import { NO, YES } from '@island.is/application/core'
import { errorMessages as coreSIAErrorMessages } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { z } from 'zod'

import { NOT_APPLICABLE } from './constants'
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
  questions: z
    .object({
      isSelfEmployed: z.enum([YES, NO]),
      isWorkingPartTime: z.enum([YES, NO]),
      isStudying: z.enum([YES, NO]),
      isSelfEmployedDate: z.string().optional(),
    })
    .refine(
      ({ isSelfEmployed, isSelfEmployedDate }) =>
        isSelfEmployed === YES ? !!isSelfEmployedDate : true,
      {
        path: ['isSelfEmployedDate'],
        params: errorMessages.dateRequired,
      },
    ),
  sickPay: z
    .object({
      option: z.enum([YES, NO, NOT_APPLICABLE]),
      doesEndDate: z.string().optional(),
      didEndDate: z.string().optional(),
    })
    .refine(
      (data) => {
        if (data.option === YES) {
          return data.didEndDate && !isNaN(Date.parse(data.didEndDate))
        }
        return true
      },
      {
        path: ['didEndDate'],
        params: errorMessages.dateRequired,
      },
    )
    .refine(
      (data) => {
        if (data.option === NO) {
          return data.doesEndDate && !isNaN(Date.parse(data.doesEndDate))
        }
        return true
      },
      {
        path: ['doesEndDate'],
        params: errorMessages.dateRequired,
      },
    ),
})

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
