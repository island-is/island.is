import * as z from 'zod'
import { isValid } from 'kennitala'

export const LoginServiceSchema = z.object({
  termsOfAgreement: z.boolean().refine((v) => v, {}),
  applicant: z.object({
    name: z.string().nonempty(),
    nationalId: z.string().refine((x) => (x ? isValid(x) : false)),
    typeOfOperation: z.string().nonempty(),
    responsiblePartyName: z.string().nonempty(),
    responsiblePartyEmail: z.string().nonempty(),
    responsiblePartyTel: z.string().nonempty(),
  }),
})

export type LoginService = z.TypeOf<typeof LoginServiceSchema>
