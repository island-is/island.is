import { z } from 'zod'

export const CitizenshipSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  userInformation: z.object({
    email: z.string().min(1),
    phone: z.string().min(1),
  }),
})

export type Citizenship = z.TypeOf<typeof CitizenshipSchema>
