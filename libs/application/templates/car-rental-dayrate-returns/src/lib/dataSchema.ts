import { z } from 'zod'
import { UploadSelection } from '../utils/constants'

const fileSchema = z.object({
  name: z.string(),
  key: z.string(),
})

const vehicleDayRateUsageRowSchema = z.object({
  permno: z.string(),
  prevPeriodUsage: z.number().min(0),
  dayRateEntryId: z.number(),
})

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  singleOrMultiSelectionRadio: z.nativeEnum(UploadSelection),
  carDayRateUsageFile: z.array(fileSchema).optional(),
  vehicleDayRateUsageRows: z.array(vehicleDayRateUsageRowSchema).optional(),
})

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
