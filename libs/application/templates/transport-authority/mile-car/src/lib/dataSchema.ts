import { z } from 'zod'

export const dataSchema = z.object({
  pickVehicle: z.object({
    vehicle: z.string().optional(),
    plate: z.string().min(1),
    vehicleHasMilesOdometer: z
      .boolean()
      .optional()
      .refine((x) => x === undefined || x === true),
  }),
})

export type MileCar = z.TypeOf<typeof dataSchema>
