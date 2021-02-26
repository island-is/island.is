import { error } from './messages/index'
import * as z from 'zod'

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v, {
    message: error.validation.approveChildrenResidenceChange.defaultMessage,
  }),
  selectChild: z
    .array(z.string())
    .min(1, { message: error.validation.selectChild.defaultMessage }),
  email: z.string().email(error.validation.invalidEmail.defaultMessage),
  phoneNumber: z
    .string()
    .min(7, { message: error.validation.invalidPhoneNumber.defaultMessage }),
  confirmResidenceChangeInfo: z
    .array(z.string())
    .length(1, error.validation.approveChildrenResidenceChange.defaultMessage),
  // selectDuration: z
  //   .enum(['temporary', 'permanent'])
  //   .optional()
  //   .refine((v) => v, {
  //     message: 'Velja þarf valmöguleika',
  //   }),
  approveTerms: z
    .array(z.string())
    .length(3, error.validation.approveTerms.defaultMessage),
  approveTermsParentB: z
    .array(z.string())
    .length(3, error.validation.approveTerms.defaultMessage),
})
