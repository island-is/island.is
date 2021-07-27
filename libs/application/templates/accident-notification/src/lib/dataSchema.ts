import * as z from 'zod'
import { error } from './messages/error'
import * as kennitala from 'kennitala'
import { AttachmentsEnum, WhoIsTheNotificationForEnum } from '../types'
import { isValid24HFormatTime } from '../utils'
import { NO, YES } from '../constants'

export enum OnBehalf {
  MYSELF = 'myself',
  OTHERS = 'others',
}

const FileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})

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
    name: z.string().min(1, error.required.defaultMessage),
    nationalId: z.string().refine((x) => (x ? kennitala.isPerson(x) : false)),
    address: z.string().min(1, error.required.defaultMessage),
    postalCode: z.string().min(1, error.required.defaultMessage),
    city: z.string().min(1, error.required.defaultMessage),
    email: z.string().email().optional(),
    phoneNumber: z.string().optional(),
  }),
  whoIsTheNotificationFor: z.object({
    answer: z.enum([
      WhoIsTheNotificationForEnum.JURIDICALPERSON,
      WhoIsTheNotificationForEnum.ME,
      WhoIsTheNotificationForEnum.POWEROFATTORNEY,
    ]),
  }),
  attachments: z.object({
    injuryCertificate: z.enum([
      AttachmentsEnum.HOSPITALSENDSCERTIFICATE,
      AttachmentsEnum.INJURYCERTIFICATE,
      AttachmentsEnum.SENDCERTIFICATELATER,
    ]),
    injuryCertificateFile: z.array(FileSchema).optional(),
  }),
  accidentDetails: z.object({
    dateOfAccident: z.string().min(1),
    timeOfAccident: z
      .string()
      .refine((x) => (x ? isValid24HFormatTime(x) : false)),
    descriptionOfAccident: z.string().min(1),
  }),
  isRepresentativeOfCompanyOrInstitue: z.enum([YES, NO]),
  companyInfo: z.object({
    nationalRegistrationId: z.string().optional(),
    descriptionField: z.string().optional(),
    name: z.string().optional(),
    email: z.string().optional(),
    phoneNumber: z.string().optional(),
  }),
  locationAndPurpose: z.object({
    location: z.string().min(1),
    postalCode: z.string().min(1),
    city: z.string().min(1),
    purpose: z.string().min(1),
  }),
})

export type AccidentNotification = z.TypeOf<typeof AccidentNotificationSchema>
