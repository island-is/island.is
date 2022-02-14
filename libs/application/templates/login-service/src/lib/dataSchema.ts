import * as z from 'zod'
import { isValid } from 'kennitala'
import { YES } from '../shared/constants'

export const LoginServiceSchema = z.object({
  termsOfAgreement: z.array(z.string()).refine((v) => v.includes(YES), {}),
  applicant: z.object({
    name: z.string().nonempty(),
    nationalId: z.string().refine((x) => (x ? isValid(x) : false)),
    typeOfOperation: z.string().nonempty(),
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
