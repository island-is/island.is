import * as z from 'zod'
import { isValid } from 'kennitala'
import { YES } from '../shared/constants'
import { errorMessages } from './messages'

export const LoginServiceSchema = z.object({
  termsOfAgreement: z.array(z.string()).refine((v) => v.includes(YES), {}),
  applicant: z.object({
    name: z.string().nonempty(),
    nationalId: z.string().refine((x) => (x ? isValid(x) : false)),
    typeOfOperation: z.string().refine((x) => x.slice(0, 2) === '84', {
      params: errorMessages.invalidIsatNumber,
    }),
    responsiblePartyName: z.string().nonempty(),
    responsiblePartyEmail: z.string().nonempty(),
    responsiblePartyTel: z.string().nonempty(),
    searchField: z
      .object({
        nationalId: z.string().optional(),
        label: z.string().optional(),
      })
      .optional(),
  }),
  technicalAnnouncements: z.object({
    email: z.string().nonempty(),
    phoneNumber: z.string().nonempty(),
    type: z.string().nonempty(),
  }),
})

export type LoginService = z.TypeOf<typeof LoginServiceSchema>
