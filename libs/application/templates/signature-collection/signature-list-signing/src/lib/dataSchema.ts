import { z } from 'zod'

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  signee: z.object({
    name: z.string(),
    nationalId: z.string(),
    address: z.string(),
    area: z.string(),
  }),
})

export type SignatureListSchema = z.TypeOf<typeof dataSchema>
