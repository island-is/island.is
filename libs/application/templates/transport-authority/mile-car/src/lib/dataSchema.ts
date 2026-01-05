import { z } from 'zod'

export const dataSchema = z.object({
  pickVehicle: z.object({
    vehicle: z.string().optional(),
    plate: z.string().min(1),
  }),
})

export type MileCar = z.TypeOf<typeof dataSchema>
