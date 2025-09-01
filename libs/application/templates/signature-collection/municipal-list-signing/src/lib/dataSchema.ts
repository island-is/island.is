import { z } from 'zod'

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  listId: z.string().min(1),
})

export type MunicipalSignListSchema = z.TypeOf<typeof dataSchema>
