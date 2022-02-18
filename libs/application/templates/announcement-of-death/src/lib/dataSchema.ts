import * as z from 'zod'
import * as kennitala from 'kennitala'
// import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { m } from './messages'
import { RoleConfirmationEnum } from '../types'

// const emailRegex = /^[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%&'*+/=?`{|}~^-]+)*@(?:[A-Z0-9-]+\.)+[A-Z]{2,6}$/i
// const isValidEmail = (value: string) => emailRegex.test(value)

// const isValidPhoneNumber = (phoneNumber: string) => {
//   const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
//   return phone && phone.isValid()
// }

// todo: set message strings for the error messages
export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  electPerson: z.object({
    roleConfirmation: z
      .enum([RoleConfirmationEnum.CONTINUE, RoleConfirmationEnum.DELEGATE])
      .refine((x) => x !== undefined, 'Þú verður að velja einn möguleika'),
    electedPersonNationalId: z.undefined().or(
      z.string().refine((x) => (x ? kennitala.isPerson(x) : false), {
        params: m.errorNationalIdIncorrect,
      }),
    ),
    electedPersonName: z.undefined().or(z.string().nonempty()),
    lookupError: z
      .undefined()
      .or(
        z
          .boolean()
          .refine(
            (v) => v === false,
            'Ekki tókst að sækja upplýsingar um kennitölu',
          ),
      ),
  }),
})
