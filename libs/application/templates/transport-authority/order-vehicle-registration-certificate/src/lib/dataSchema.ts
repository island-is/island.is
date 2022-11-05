import { z } from 'zod'

export const OrderVehicleRegistrationCertificateSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  vehicle: z.object({
    plate: z.string(),
  }),
})

export type OrderVehicleRegistrationCertificate = z.TypeOf<
  typeof OrderVehicleRegistrationCertificateSchema
>
