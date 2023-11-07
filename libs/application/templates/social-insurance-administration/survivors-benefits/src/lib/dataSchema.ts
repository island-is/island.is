import { z } from 'zod'

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
})

export type SchemaFormValues = z.infer<typeof dataSchema>
