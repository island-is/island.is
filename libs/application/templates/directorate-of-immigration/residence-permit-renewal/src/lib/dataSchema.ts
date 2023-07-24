import { z } from 'zod'

export const ResidencePermitRenewalSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  userInformation: z.object({
    email: z.string().min(1),
    phone: z.string().min(1),
    securityPin: z.string().min(4),
  }),
  selectedIndividuals: z.array(z.string()).optional(),
})

export type ResidencePermitRenewal = z.TypeOf<
  typeof ResidencePermitRenewalSchema
>
