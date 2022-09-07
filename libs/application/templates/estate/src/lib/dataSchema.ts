import * as z from 'zod'

export const estateSchema = z.object({
  selectedEstate: z.enum([
    'Eignalaust dánarbú',
    'Einkaskipti',
    'Opinber skipti',
    'Búsetuleyfi',
  ]),
})
