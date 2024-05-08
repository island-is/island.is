import { z } from 'zod'

export const DataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
})

export type SchemaFormValues = z.infer<typeof DataSchema>
