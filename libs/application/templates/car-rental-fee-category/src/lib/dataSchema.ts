import { z } from 'zod'
import { RateCategory } from '../utils/constants'

const fileSchema = z.object({
  name: z.string(),
  key: z.string(),
})

const vehicleLatestMilageRowSchema = z.object({
  permno: z.string(),
  latestMilage: z.number().min(0),
})

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  categorySelectionRadio: z.nativeEnum(RateCategory),
  carCategoryFile: z.array(fileSchema).min(1),
  vehicleLatestMilageRows: z.array(vehicleLatestMilageRowSchema).optional(),
})

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
