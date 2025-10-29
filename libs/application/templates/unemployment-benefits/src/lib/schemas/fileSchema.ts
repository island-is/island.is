import { z } from 'zod'

export const FileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})
