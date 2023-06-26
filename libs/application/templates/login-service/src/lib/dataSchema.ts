import { z } from 'zod'
import { isValid } from 'kennitala'
import { YES } from '../shared/constants'

export const LoginServiceSchema = z.object({
  termsOfAgreement: z.array(z.string()).refine((v) => v.includes(YES), {}),
  selectCompany: z.object({
    searchField: z
      .object({
        nationalId: z.string().min(1),
        label: z.string().min(1),
        isat: z.string().optional(),
      })
      .optional(),
  }),
  applicant: z.object({
    name: z.string().min(1),
    nationalId: z.string().refine((x) => (x ? isValid(x) : false)),
    typeOfOperation: z.string(),
    // typeOfOperation: z.string().refine((x) => x.slice(0, 2) === '84', {
    //   params: errorMessages.invalidIsatNumber,
    // }),
    responsiblePartyName: z.string().min(1),
    responsiblePartyEmail: z.string().min(1),
    responsiblePartyTel: z.string().min(1),
  }),
  technicalAnnouncements: z.object({
    email: z.string().min(1),
    phoneNumber: z.string().min(1),
    type: z.string().min(1),
  }),
})

export type LoginService = z.TypeOf<typeof LoginServiceSchema>
