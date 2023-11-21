import { z } from 'zod'

export const HealthcareLicenseCertificateSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  selectLicence: z.object({
    professionId: z.string().min(1),
  }),
})

export type HealthcareLicenseCertificate = z.TypeOf<
  typeof HealthcareLicenseCertificateSchema
>
