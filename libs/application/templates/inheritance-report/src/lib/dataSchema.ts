import * as z from 'zod'

export const inheritanceReportSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),

  /* assets */
  realEstate: z.object({
    data: z
      .object({
        assetNumber: z.string(),
        description: z.string(),
        propertyValuation: z.string().refine((v) => v),
      })
      .array()
      .optional(),
    total: z.number().optional(),
  }),
  vehicles: z.object({
    data: z
      .object({
        assetNumber: z.string(),
        description: z.string(),
        propertyValuation: z.string().refine((v) => v),
      })
      .array()
      .optional(),
    total: z.number().optional(),
  }),
})
