import { error } from './messages/index'
import * as z from 'zod'
import { InterviewFieldIds } from '../types'

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
    .min(1, { message: error.validation.selectChild.defaultMessage }),
  residenceChangeReason: z.string().optional(),
  parentA: parentContactInfo,
  counterParty: parentContactInfo,
  parentB: parentContactInfo,
  approveTerms: terms,
  approveTermsParentB: terms,
  confirmResidenceChangeInfo: z
    .array(z.string())
    .length(1, error.validation.approveChildrenResidenceChange.defaultMessage),
  durationType: z
    .enum(['permanent', 'temporary'])
    .optional()
    .refine((v) => v, error.validation.durationType.defaultMessage),
  durationDate: z
    .string()
    .optional()
    .refine((v) => v && v !== '', error.validation.durationDate.defaultMessage),
})

export type answersSchema = z.infer<typeof dataSchema>
