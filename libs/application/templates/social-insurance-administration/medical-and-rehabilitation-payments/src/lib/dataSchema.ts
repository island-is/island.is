import { NO, YES } from '@island.is/application/core'
import { errorMessages as coreSIAErrorMessages } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { z } from 'zod'
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
})

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
