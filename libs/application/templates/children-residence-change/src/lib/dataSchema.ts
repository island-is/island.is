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

const validateTerms = (arrayLength: number) => {
  return z.array(z.string()).refine((v) => v && v.length === arrayLength, {
    params: error.validation.approveTerms,
  })
}

enum Duration {
  Permanent = 'permanent',
  Temporary = 'temporary',
}

export enum ApproveContract {
  Yes = 'yes',
  No = 'no',
}

const parentContactInfo = z.object({
  email: z.string().refine((v) => isValidEmail(v), {
    params: error.validation.invalidEmail,
  }),
  phoneNumber: z.string().refine((v) => v && v.length >= 7, {
    params: error.validation.invalidPhoneNumber,
  }),
})

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
  approveTerms: validateTerms(2),
  approveTermsParentB: validateTerms(2),
  approveChildSupportTerms: validateTerms(1),
  approveChildSupportTermsParentB: validateTerms(1),
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
  acceptContract: z
    .enum([ApproveContract.Yes, ApproveContract.No])
    .refine((v) => v, {
      params: error.validation.acceptContract,
    }),
})

export type answersSchema = z.infer<typeof dataSchema>
