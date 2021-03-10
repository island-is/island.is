import { error } from './messages/index'
import * as z from 'zod'

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
  selectChild: z
    .array(z.string())
    .min(1, { message: error.validation.selectChild.defaultMessage }),
  residenceChangeReason: z.string().optional(),
  parentA: parentContactInfo,
  parentB: parentContactInfo,
  approveTerms: terms,
  approveTermsParentB: terms,
  confirmResidenceChangeInfo: z
    .array(z.string())
    .length(1, error.validation.approveChildrenResidenceChange.defaultMessage),
  // selectDuration: z
  //   .enum(['temporary', 'permanent'])
  //   .optional()
  //   .refine((v) => v, {
  //     message: 'Velja þarf valmöguleika',
  //   }),
  selectDuration: z.array(z.string()).optional(),
  interview: z.enum(['yes', 'no']).refine((v) => v, {
    message: error.validation.interview.defaultMessage,
  }),
})

export type answersSchema = z.infer<typeof dataSchema>
