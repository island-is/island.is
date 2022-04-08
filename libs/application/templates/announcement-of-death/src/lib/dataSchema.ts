import * as z from 'zod'
import * as kennitala from 'kennitala'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { m } from './messages'
import { RoleConfirmationEnum } from '../types'

const emailRegex = /^[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%&'*+/=?`{|}~^-]+)*@(?:[A-Z0-9-]+\.)+[A-Z]{2,6}$/i
const isValidEmail = (value: string) => emailRegex.test(value)

const isValidPhoneNumber = (phoneNumber: string) => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone && phone.isValid()
}

// todo: set message strings for the error messages
export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  roleConfirmation: z
    .enum([RoleConfirmationEnum.CONTINUE, RoleConfirmationEnum.DELEGATE])
    .refine((x) => x !== undefined, { params: m.errorRoleConfirmation }),
  electPerson: z.object({
    electedPersonNationalId: z.undefined().or(
      z.string().refine((x) => (x ? kennitala.isPerson(x) : false), {
        params: m.errorNationalIdIncorrect,
      }),
    ),
    electedPersonName: z.string().nonempty(),
  }),
  applicantPhone: z.string().refine((v) => isValidPhoneNumber(v), {
    params: m.errorPhoneNumber,
  }),
  applicantEmail: z.string().refine((v) => isValidEmail(v), {
    params: m.errorEmail,
  }),
  applicantRelation: z
    .string()
    .refine((x) => x !== undefined, { params: m.errorRelation }), // TODO: try to get custom error message
})
