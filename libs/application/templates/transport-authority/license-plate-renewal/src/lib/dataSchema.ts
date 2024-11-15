import { z } from 'zod'

export const LicensePlateRenewalSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  pickPlate: z.object({
    regno: z.string().min(1),
    value: z.string().optional(), // index
  }),
})

export type LicensePlateRenewal = z.TypeOf<typeof LicensePlateRenewalSchema>
