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

const parentContactInfo = z.object({
  email: z.string().refine((v) => isValidEmail(v), {
    params: error.validation.invalidEmail,
  }),
  phoneNumber: z.string().refine((v) => v && v.length >= 7, {
    params: error.validation.invalidPhoneNumber,
  }),
})

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v, {
    params: error.validation.dataGathering,
  }),
  selectedChildren: z
    .array(z.string())
    .refine((v) => v && v.length > 0, { params: error.validation.selectChild }),
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
})

export type answersSchema = z.infer<typeof dataSchema>
