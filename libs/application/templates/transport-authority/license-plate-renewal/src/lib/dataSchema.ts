import { z } from 'zod'

export const LicensePlateRenewalSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  pickPlate: z.object({
    regno: z.string().min(1),
    value: z.string().min(1),
  }),
  information: z.object({
    plate: z.string().min(1),
    dateFrom: z.string().min(1),
    plateTo: z.string().min(1),
    nationalId: z.string().min(1),
    name: z.string().min(1),
  }),
})

export type LicensePlateRenewal = z.TypeOf<typeof LicensePlateRenewalSchema>
