import { z } from 'zod'

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  applicant: z.object({
    name: z.string(),
    nationalId: z.string(),
    phone: z.string().min(11),
    email: z.string().email(),
  }),
  collection: z.object({
    dateFrom: z.string(),
    dateTil: z.string(),
  }),
})

export type SignatureListSchema = z.TypeOf<typeof dataSchema>
