import { z } from 'zod'

export const DigitalTachographCompanyCardSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
})

export type DigitalTachographCompanyCard = z.TypeOf<
  typeof DigitalTachographCompanyCardSchema
>
