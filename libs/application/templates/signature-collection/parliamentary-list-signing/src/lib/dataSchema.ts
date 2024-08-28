import { z } from 'zod'

export const dataSchema = z.object({
  /* Gagnaöflun */
  approveExternalData: z.boolean().refine((v) => v),

  /* Upplýsingar */
  signee: z.object({
    name: z.string(),
    nationalId: z.string(),
  }),
})

export type ParliamentarySignListSchema = z.TypeOf<typeof dataSchema>
