import { z } from 'zod'

export const UserInformationSchema = z.object({
  nationalId: z.string(),
  name: z.string(),
  email: z.string(),
  // phone: z.string().optional(),
})

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
  seller: UserInformationSchema,
  coOwner: z.array(UserInformationSchema),
  buyer: UserInformationSchema,
  coOwnerAndOperator: z.array(
    z.object({
      nationalId: z.string(),
      name: z.string(),
      email: z.string(),
      // phone: z.string().optional(),
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
