import * as z from 'zod'
import * as kennitala from 'kennitala'
import { m } from './messages'

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  student: z.object({
    name: z.string().nonempty(),
    nationalId: z.string().refine((x) => (x ? kennitala.isPerson(x) : false), {
      params: m.invalidNationalIdValue,
    }),
  }),
  email: z.string(),
  confirmation: z.object({
    date: z.string().nonempty(),
    school: z.string().nonempty(),
  }),
})
