import * as z from 'zod'

export const inheritanceReportSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  inventoryTotalAmount: z.number().optional(),
})
