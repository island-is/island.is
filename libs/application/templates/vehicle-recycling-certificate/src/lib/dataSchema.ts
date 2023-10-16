import { z } from 'zod'

export const DataSchema = z.object({})

export type SchemaFormValues = z.infer<typeof DataSchema>
