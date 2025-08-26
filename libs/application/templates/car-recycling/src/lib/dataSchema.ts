import { z } from 'zod'
import { FuelCodes } from '../shared'
import { errorMessages } from './messages'

const Vehicles = z
  .object({
    make: z.string(),
    role: z.string(),
    permno: z.string(),
    mileage: z.string().optional(),
    fuelCode: z.string().optional(), // Not used any more, kept here to keep backwards compatibility
    requiresMileageRegistration: z.boolean().optional(),
    latestMileage: z.number().optional().nullable(),
  })
  .refine(
    ({ requiresMileageRegistration, fuelCode, mileage }) =>
      requiresMileageRegistration ||
      Object.values(FuelCodes).includes(fuelCode as FuelCodes)
        ? Boolean(mileage && mileage !== '' && mileage !== '0 ')
        : true,
    { path: ['mileage'], params: errorMessages.mileageMissing },
  )
  .refine(
    ({ mileage, latestMileage }) => {
      // Mileage is an string and we need to convert it to a number and remove the dot
      const computedMileage = +(mileage ?? '0').replace('.', '')

      // If the owner decided to enter mileage then we need to check if the mileage is greater than or equal than last mileage registration
      if (computedMileage > 0 && latestMileage) {
        return computedMileage >= latestMileage
      }

      return true
    },
    {
      path: ['mileage'],
      params: errorMessages.mileageLowerThanLast,
    },
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
