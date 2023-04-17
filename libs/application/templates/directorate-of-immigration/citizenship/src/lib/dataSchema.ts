import { z } from 'zod'

export const CitizenshipSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
})

export type Citizenship = z.TypeOf<typeof CitizenshipSchema>
