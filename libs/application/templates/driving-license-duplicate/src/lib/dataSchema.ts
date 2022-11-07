import { z } from 'zod'

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  nationalId: z.string(),
  name: z.string(),
  district: z.string(),
})

export type PSignSchema = z.TypeOf<typeof dataSchema>
