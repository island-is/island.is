import * as z from 'zod'

export const estateSchema = z.object({
  selectedEstate: z.enum([
    'Eignarlaust dánarbú',
    'Einkaskipti',
    'Opinber skipti',
    'Búsetuleyfi',
  ]),
})
