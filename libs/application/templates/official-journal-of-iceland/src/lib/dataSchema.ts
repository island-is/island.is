import { z } from 'zod'

export const OfficialJournalOfIcelandSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v, {}),
})
