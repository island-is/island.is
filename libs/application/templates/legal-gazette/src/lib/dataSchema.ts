import { z } from 'zod'

export const legalGazetteDataSchema = z.object({
  requirements: z.boolean(),
})
