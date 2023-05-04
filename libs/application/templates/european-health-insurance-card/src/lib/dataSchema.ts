import { z } from 'zod'

export const checkboxSchema = z
  .object({
    applyForPlastic: z.array(z.string()).optional(),
    addForPDF: z.array(z.string()).optional(),
  })
  .refine((v) => v.applyForPlastic?.length || v.addForPDF?.length)

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  delimitations: checkboxSchema,
})
