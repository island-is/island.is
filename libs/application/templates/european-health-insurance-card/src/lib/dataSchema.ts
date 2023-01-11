import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(1),
})

export const dataSchema = z.object({
  applicant: z.object({
    hasLogin: z.boolean().optional(),
  }),

  contact: contactSchema,
})
