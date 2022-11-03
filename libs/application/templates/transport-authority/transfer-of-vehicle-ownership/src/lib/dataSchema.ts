import * as z from 'zod'

export const TransferOfVehicleOwnershipSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  pickVehicle: z.object({
    vehicle: z.string().optional(),
    plate: z.string().min(1),
  }),
  vehicle: z.object({
    plate: z.string(),
    type: z.string(),
    salePrice: z.string(),
    date: z.string(),
  }),
  seller: z.object({
    nationalId: z.string(),
    name: z.string(),
    email: z.string(),
  }),
  coOwner: z.array(
    z.object({
      nationalId: z.string(),
      name: z.string(),
      email: z.string(),
    }),
  ),
  buyer: z.object({
    nationalId: z.string(),
    name: z.string(),
    email: z.string(),
  }),
  coOwnerAndOperator: z.array(
    z.object({
      nationalId: z.string(),
      name: z.string(),
      email: z.string(),
      type: z.enum(['operator', 'coOwner']),
    }),
  ),
  mainOperator: z.object({
    nationalId: z.string(),
  }),
})

export type TransferOfVehicleOwnership = z.TypeOf<
  typeof TransferOfVehicleOwnershipSchema
>
