import { z } from 'zod'
import { RegistrationType } from '../utils/constants'
import { m } from './messages'

const vehicleMileageEntrySchema = z
  .object({
    mileage: z.string().min(1),
    lastMileage: z.string(),
  })
  .superRefine((entry, ctx) => {
    const mileage = Number(entry.mileage)
    const lastMileage = Number(entry.lastMileage ?? '0')
    if (mileage < lastMileage) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        params: m.dataSchema.mileageTooLow,
        path: ['mileage'],
      })
    }
  })

const uploadFileSchema = z.object({
  name: z.string(),
  key: z.string(),
})

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  registrationType: z.nativeEnum(RegistrationType),
  selectedExportVehicles: z.array(z.string()).min(1),
  selectedImportVehicles: z.array(z.string()).min(1),
  exportDate: z.string().min(1),
  importDate: z.string().min(1),
  exportVehicleMileage: z.array(vehicleMileageEntrySchema).min(1),
  importVehicleMileage: z.array(vehicleMileageEntrySchema).min(1),
  importVehicleMileageFile: z.array(uploadFileSchema).min(1),
})

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
