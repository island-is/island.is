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
  pickRole: z
    .object({
      roleConfirmation: z
        .enum([RoleConfirmationEnum.CONTINUE, RoleConfirmationEnum.DELEGATE]),
      electPerson: z.object({
        electedPersonNationalId: z.string(),
        electedPersonName: z.string(),
      }),
    })
    .refine(
      ({ roleConfirmation, electPerson }) =>
        !!roleConfirmation &&
        ((roleConfirmation === RoleConfirmationEnum.DELEGATE &&
          kennitala.isPerson(electPerson?.electedPersonNationalId) &&
          electPerson?.electedPersonName !== '') ||
          (roleConfirmation === RoleConfirmationEnum.CONTINUE &&
            electPerson.electedPersonNationalId === '' &&
            electPerson.electedPersonName === '')),
      {
        message: m.errorNationalIdIncorrect.defaultMessage,
        path: ['electPerson', 'electedPersonNationalId'],
      },
    )
    .refine(({ roleConfirmation }) => !!roleConfirmation, {
      message: m.errorRoleConfirmation.defaultMessage,
      path: ['roleConfirmation'],
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
