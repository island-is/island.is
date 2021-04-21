import { error } from './messages/index'
import * as z from 'zod'

enum Duration {
  Permanent = 'permanent',
  Temporary = 'temporary',
}

const parentContactInfo = z.object({
  email: z.string().email(error.validation.invalidEmail.defaultMessage),
  phoneNumber: z.string().min(7, {
    message: error.validation.invalidPhoneNumber.defaultMessage,
  }),
})

const terms = z
  .array(z.string())
  .length(3, error.validation.approveTerms.defaultMessage)

export const dataSchema = z.object({
  useMocks: z.enum(['yes', 'no']).optional(),
  approveExternalData: z.boolean().refine((v) => v, {
    message: error.validation.approveChildrenResidenceChange.defaultMessage,
  }),
  selectedChildren: z
    .array(z.string())
    .min(1, error.validation.selectChild.defaultMessage),
  residenceChangeReason: z.string().optional(),
  parentA: parentContactInfo,
  counterParty: parentContactInfo,
  parentB: parentContactInfo,
  approveTerms: terms,
  approveTermsParentB: terms,
  confirmResidenceChangeInfo: z
    .array(z.string())
    .length(1, error.validation.approveChildrenResidenceChange.defaultMessage),
  selectDuration: z
    .object({
      type: z.enum([Duration.Permanent, Duration.Temporary]),
      date: z.string().optional(),
    })
    .refine((v) => (v.type === Duration.Temporary ? v.date : true), {
      message: error.validation.durationDate.defaultMessage,
      path: ['date'],
    }),
})

export type answersSchema = z.infer<typeof dataSchema>
