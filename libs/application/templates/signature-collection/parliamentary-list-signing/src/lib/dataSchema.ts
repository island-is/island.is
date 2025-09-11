import { z } from 'zod'

export const dataSchema = z.object({
  /* Gagnaöflun */
  approveExternalData: z.boolean().refine((v) => v),
  listId: z.string().min(1),
  list: z.object({
    name: z.string(),
    letter: z.string().optional(), // Todo: change to required once tests are done,
  }),

  /* Upplýsingar */
  signee: z.object({
    name: z.string(),
    nationalId: z.string(),
  }),
})

export type ParliamentarySignListSchema = z.TypeOf<typeof dataSchema>
