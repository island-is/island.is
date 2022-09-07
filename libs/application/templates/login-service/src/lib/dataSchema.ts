import * as z from 'zod'
import { isValid } from 'kennitala'
import { YES } from '../shared/constants'
import { errorMessages } from './messages'

export const LoginServiceSchema = z.object({
  termsOfAgreement: z.array(z.string()).refine((v) => v.includes(YES), {}),
  selectCompany: z.object({
    searchField: z
      .object({
        nationalId: z.string().nonempty(),
        label: z.string().nonempty(),
        isat: z.string().optional(),
      })
      .optional(),
  }),
  applicant: z.object({
    name: z.string().nonempty(),
    nationalId: z.string().refine((x) => (x ? isValid(x) : false)),
    typeOfOperation: z.string(),
    // typeOfOperation: z.string().refine((x) => x.slice(0, 2) === '84', {
    //   params: errorMessages.invalidIsatNumber,
    // }),
    responsiblePartyName: z.string().nonempty(),
    responsiblePartyEmail: z.string().nonempty(),
    responsiblePartyTel: z.string().nonempty(),
  }),
  technicalAnnouncements: z.object({
    email: z.string().nonempty(),
    phoneNumber: z.string().nonempty(),
    type: z.string().nonempty(),
  }),
})

export type LoginService = z.TypeOf<typeof LoginServiceSchema>
