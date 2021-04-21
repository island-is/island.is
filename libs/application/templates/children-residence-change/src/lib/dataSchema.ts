import { error } from './messages/index'
import * as z from 'zod'

const emailRegex = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i
const isValidEmail = (value: string) => emailRegex.test(value)

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
  counterParty: z
    .object({
      email: z.string().refine((v) => (v && isValidEmail(v)) || v === '', {
        message: error.validation.invalidEmail.defaultMessage,
      }),
      phoneNumber: z.string().refine((v) => (v && v.length === 7) || v === '', {
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
