import * as z from 'zod'

export const OrderVehicleRegistrationCertificateSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
})

export type OrderVehicleRegistrationCertificate = z.TypeOf<
  typeof OrderVehicleRegistrationCertificateSchema
>
