import { z } from 'zod'

export const ResidencePermitRenewalSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  userInformation: z.object({
    email: z.string().min(1),
    phone: z.string().min(1),
  }),
})

export type ResidencePermitRenewal = z.TypeOf<
  typeof ResidencePermitRenewalSchema
>
