import * as z from 'zod'

export const inheritanceReportSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  heirs: z.object({
    total: z.number().refine((v) => v === 100),
  }),
})
