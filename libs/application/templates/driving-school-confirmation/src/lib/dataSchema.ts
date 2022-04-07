import * as z from 'zod'

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  nationalId: z.string().nonempty(),
  email: z.string(),
  confirmation: z.object({
    date: z.string().nonempty(),
    school: z.string().nonempty(),
  }),
})
