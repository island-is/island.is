import { z } from 'zod'

export const OrderVehicleRegistrationCertificateSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  pickVehicle: z.object({
    vehicle: z.string().optional(), // index
    plate: z.string().min(1),
  }),
  vehicle: z.object({
    plate: z.string(),
    type: z.string(),
  }),
})

export type OrderVehicleRegistrationCertificate = z.TypeOf<
  typeof OrderVehicleRegistrationCertificateSchema
>
