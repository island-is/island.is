import { z } from 'zod'
import { RateCategory, UploadSelection } from '../utils/constants'

const carCategoryRecordSchema = z.object({
  vehicleId: z.string().min(1),
  oldMileage: z.number(),
  newMilage: z.number(),
  rateCategory: z.nativeEnum(RateCategory)
})

export const dataSchema = z
  .object({
    categorySelectionRadio: z.nativeEnum(RateCategory),
    singleOrMultiSelectionRadio: z.nativeEnum(UploadSelection),
    carsToChange: z.array(carCategoryRecordSchema).min(1),
  })

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>