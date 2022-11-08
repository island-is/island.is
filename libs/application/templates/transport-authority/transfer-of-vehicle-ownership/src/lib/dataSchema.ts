import { z } from 'zod'

export const UserInformationSchema = z.object({
  nationalId: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string().optional(),
})

export const CoOwnerAndOperatorSchema = z.object({
  nationalId: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string().optional(),
  type: z.enum(['operator', 'coOwner']),
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
  sellerCoOwner: z.array(UserInformationSchema),
  buyer: UserInformationSchema,
  buyerCoOwnerAndOperator: z.array(CoOwnerAndOperatorSchema),
  buyerMainOperator: z.object({
    nationalId: z.string(),
  }),
  insurance: z.object({
    value: z.string(),
    name: z.string(),
  }),
})

export type TransferOfVehicleOwnership = z.TypeOf<
  typeof TransferOfVehicleOwnershipSchema
>
