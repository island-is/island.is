import * as z from 'zod'
import { EstateTypes } from './constants'

export const estateSchema = z.object({
  selectedEstate: z.enum([
    EstateTypes.officialEstate,
    EstateTypes.noPropertyEstate,
  ]),
})
