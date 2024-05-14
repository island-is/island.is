import { z } from 'zod'

export const DataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  children: z.object({
    option: z.string().min(1),
  }),
})

export type SchemaFormValues = z.infer<typeof DataSchema>
