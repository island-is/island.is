import { z } from 'zod'

export const dataSchema = z.object({
  applicant: z.object({
    email: z.string().email().nonempty(),
  }),
})
