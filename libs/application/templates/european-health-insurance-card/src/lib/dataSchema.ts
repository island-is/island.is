import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(1),
})

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  externalData: z.object({
    identityRegistry: z.object({
      data: z.object({
        date: z.string(),
        status: z.enum(['success', 'failure']),
        name: z.string(),
        nationalId: z.string(),
        address: z.object({
          streetAddress: z.string(),
          city: z.string(),
          postalCode: z.string(),
        }),
      }),
    }),
  }),
  applicant: z.object({
    hasLogin: z.boolean().optional(),
  }),

  contact: contactSchema,
})
