import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(1),
})

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  // applyForPlastic: z.array(z.string()).refine((v) => v.length > 0, {}),
  contact: contactSchema,
})
