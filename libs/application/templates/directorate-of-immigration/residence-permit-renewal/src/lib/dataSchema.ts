import { z } from 'zod'

export const ResidencePermitRenewalSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
})

export type ResidencePermitRenewal = z.TypeOf<
  typeof ResidencePermitRenewalSchema
>
