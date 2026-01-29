import { z } from 'zod'
import { RateCategory } from '../utils/constants'

const fileSchema = z.object({
  name: z.string(),
  key: z.string(),
})

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  categorySelectionRadio: z.nativeEnum(RateCategory),
  carCategoryFile: z.array(fileSchema).min(1),
})

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
