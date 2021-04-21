import { error } from './messages/index'
import * as z from 'zod'

const emailRegex = /^[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%&'*+/=?`{|}~^-]+)*@(?:[A-Z0-9-]+\.)+[A-Z]{2,6}$/i
const isValidEmail = (value: string) => emailRegex.test(value)

const validateOptionalEmail = (value: string) => {
  return (value && isValidEmail(value)) || value === ''
}

const validateOptionalPhoneNumber = (value: string) => {
  return (value && value.length === 7) || value === ''
}

enum Duration {
  Permanent = 'permanent',
  Temporary = 'temporary',
}

const parentContactInfo = z.object({
  email: z.string().refine((v) => isValidEmail(v), {
    message: error.validation.invalidEmail.defaultMessage,
  }),
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
  counterParty: z
    .object({
      email: z.string().refine((v) => validateOptionalEmail(v), {
        message: error.validation.invalidEmail.defaultMessage,
      }),
      phoneNumber: z.string().refine((v) => validateOptionalPhoneNumber(v), {
        message: error.validation.invalidPhoneNumber.defaultMessage,
      }),
    })
    .refine((v) => v.email || v.phoneNumber, {
      message: error.validation.counterParty.defaultMessage,
    }),
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
