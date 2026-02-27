import { z } from 'zod'
import { RegistrationType } from '../utils/constants'

const vehicleMileageEntrySchema = z
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

const uploadFileSchema = z.object({
  name: z.string(),
  key: z.string().optional(),
})

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  registrationType: z.nativeEnum(RegistrationType),
  selectedExportVehicles: z.array(z.string()).min(1).optional(),
  selectedImportVehicles: z.array(z.string()).min(1).optional(),
  exportDate: z.string().min(1).optional(),
  importDate: z.string().min(1).optional(),
  exportVehicleMileage: z.array(vehicleMileageEntrySchema).min(1).optional(),
  importVehicleMileage: z.array(vehicleMileageEntrySchema).min(1).optional(),
  importVehicleMileageFile: z.array(uploadFileSchema).min(1).optional(),
  })

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
