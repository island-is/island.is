import * as z from 'zod'
import { error } from './messages/error'
import * as kennitala from 'kennitala'

export enum OnBehalf {
  MYSELF = 'myself',
  OTHERS = 'others',
}

export const AccidentNotificationSchema = z.object({
  externalData: z.object({
    nationalRegistry: z.object({
      data: z.object({
        address: z.object({
          city: z.string(),
          code: z.string(),
          postalCode: z.string(),
          streetAddress: z.string(),
        }),
        age: z.number(),
        citizenship: z.object({
          code: z.string(),
          name: z.string(),
        }),
        fullName: z.string(),
        legalResidence: z.string(),
        nationalId: z.string(),
      }),
      date: z.string(),
      status: z.enum(['success', 'failure']),
    }),
    userProfile: z.object({
      data: z.object({
        email: z.string(),
        mobilePhoneNumber: z.string(),
      }),
      date: z.string(),
      status: z.enum(['success', 'failure']),
    }),
  }),
  approveExternalData: z.boolean().refine((p) => p),
  info: z.object({
    onBehalf: z.enum([OnBehalf.MYSELF, OnBehalf.OTHERS]),
  }),
  applicant: z.object({
    name: z.string().nonempty(error.required.defaultMessage),
    nationalId: z.string().refine((x) => (x ? kennitala.isPerson(x) : false)),
    address: z.string().nonempty(error.required.defaultMessage),
    postalCode: z.string().nonempty(error.required.defaultMessage),
    city: z.string().nonempty(error.required.defaultMessage),
    email: z.string().email().optional(),
    phoneNumber: z.string().optional(),
  }),
})

export type AccidentNotification = z.TypeOf<typeof AccidentNotificationSchema>
