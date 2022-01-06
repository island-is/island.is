import { error } from './messages/index'
import * as z from 'zod'

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v, {
    params: error.validation.dataGathering,
  }),
})

export type answersSchema = z.infer<typeof dataSchema>
