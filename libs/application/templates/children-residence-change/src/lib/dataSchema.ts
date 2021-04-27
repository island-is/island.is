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
    params: error.validation.invalidEmail,
  }),
  phoneNumber: z.string().refine((v) => v && v.length >= 7, {
    params: error.validation.invalidPhoneNumber,
  }),
})

const terms = z
  .array(z.string())
  .refine((v) => v && v.length === 3, { params: error.validation.approveTerms })

export const dataSchema = z.object({
  useMocks: z.enum(['yes', 'no']).optional(),
  approveExternalData: z.boolean().refine((v) => v, {
    params: error.validation.approveChildrenResidenceChange,
  }),
  selectedChildren: z
    .array(z.string())
    .refine((v) => v && v.length > 0, { params: error.validation.selectChild }),
  residenceChangeReason: z.string().optional(),
  parentA: parentContactInfo,
  counterParty: z
    .object({
      email: z.string().refine((v) => validateOptionalEmail(v), {
        params: error.validation.invalidEmail,
      }),
      phoneNumber: z.string().refine((v) => validateOptionalPhoneNumber(v), {
        params: error.validation.invalidPhoneNumber,
      }),
    })
    .refine((v) => v.email || v.phoneNumber, {
      params: error.validation.counterParty,
    }),
  parentB: parentContactInfo,
  approveTerms: terms,
  approveTermsParentB: terms,
  confirmResidenceChangeInfo: z
    .array(z.string())
    .refine((v) => v && v.length === 1, {
      params: error.validation.approveChildrenResidenceChange,
    }),
  selectDuration: z
    .object({
      type: z.enum([Duration.Permanent, Duration.Temporary]).refine((v) => v, {
        params: error.validation.durationType,
      }),
      date: z.string().optional(),
    })
    .refine((v) => (v.type === Duration.Temporary ? v.date : true), {
      params: error.validation.durationDate,
      path: ['date'],
    }),
})

export type answersSchema = z.infer<typeof dataSchema>
