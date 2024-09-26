import { z } from 'zod'

export const dataSchema = z.object({
  /* Gagnaöflun */
  approveExternalData: z.boolean().refine((v) => v),
  list: z.object({
    name: z.string(),
    letter: z.string(),
  }),

  /* Upplýsingar */
  signee: z.object({
    name: z.string(),
    nationalId: z.string(),
  }),
})

export type ParliamentarySignListSchema = z.TypeOf<typeof dataSchema>
