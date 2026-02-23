import { z } from 'zod'
import { RegistrationType } from '../utils/constants'

const vehicleMileageEntry = z
  .object({
    mileage: z.string().min(1),
    lastMileage: z.string().optional(),
  })
  .refine(
    (entry) => {
      const mileage = Number(entry.mileage)
      const lastMileage = Number(entry.lastMileage ?? '0')
      return mileage >= lastMileage
    },
    {
      message: 'Km staða má ekki vera lægri en síðasta skráða km staða',
      path: ['mileage'],
    },
  )

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  registrationType: z.nativeEnum(RegistrationType),
  selectedVehicles: z.array(z.string()).min(1),
  departureDate: z.string().min(1),
  returnDate: z.string().optional(),
  vehicleMileage: z.array(vehicleMileageEntry).min(1),
})

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
