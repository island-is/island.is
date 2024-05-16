import { z } from 'zod'

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  childsNationalId: z.string().min(1),
})

export type SchemaFormValues = z.infer<typeof dataSchema>
