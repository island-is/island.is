import { z } from 'zod'

export const ResidencePermitPermanentSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
})

export type ResidencePermitPermanent = z.TypeOf<
  typeof ResidencePermitPermanentSchema
>
