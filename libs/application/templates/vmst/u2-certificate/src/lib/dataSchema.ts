import { YES } from '@island.is/application/core'
import { z } from 'zod'

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  countryAndDate: z.object({
    country: z.string().min(1),
    departureDate: z.string().min(1),
  }),
  infoCheckbox: z.array(z.string()).refine((v) => {
    return v.length > 0 && v.includes(YES)
  }),
})

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
