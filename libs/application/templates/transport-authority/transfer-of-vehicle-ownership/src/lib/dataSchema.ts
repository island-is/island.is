import * as z from 'zod'
import { error } from './messages'

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
    phone: z.string(),
    email: z.string(),
  }),
  coOwner: z.object({
    nationalId: z.string(),
    name: z.string(),
    phone: z.string(),
    email: z.string(),
  }),
  buyer: z.object({
    nationalId: z.string(),
    name: z.string(),
    phone: z.string(),
    email: z.string(),
  }),
})

export type TransferOfVehicleOwnership = z.TypeOf<
  typeof TransferOfVehicleOwnershipSchema
>
