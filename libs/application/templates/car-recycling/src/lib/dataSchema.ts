import { z } from 'zod'
import { FuelCodes } from '../shared'

const Vehicles = z
  .object({
    make: z.string(),
    role: z.string(),
    color: z.string(),
    permno: z.string(),
    mileage: z.string().optional(),
    fuelCode: z.string(),
  })
  .refine(
    ({ fuelCode, mileage }) =>
      Object.values(FuelCodes).includes(fuelCode as FuelCodes)
        ? Boolean(mileage && mileage !== '' && mileage !== '0 ')
        : true,
    { path: ['mileage'] },
  )

export const DataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  vehicles: z
    .object({
      selectedVehicles: z.array(Vehicles),
      canceledVehicles: z.array(Vehicles),
    })
    .refine(({ selectedVehicles, canceledVehicles }) => {
      return (
        selectedVehicles.length > 0 ||
        (canceledVehicles.length > 0 && selectedVehicles.length === 0)
      )
    }),
})

export type SchemaFormValues = z.infer<typeof DataSchema>
