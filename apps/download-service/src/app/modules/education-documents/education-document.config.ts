import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  primarySchoolPdfTimeoutMs: z.number().int().positive(),
})

export const EducationDocumentsConfig = defineConfig<z.infer<typeof schema>>({
  name: 'EducationDocumentsConfig',
  schema,
  load(env) {
    return {
      primarySchoolPdfTimeoutMs:
        env.optionalJSON('REQUEST_TIMEOUT_MS') ?? 30000,
    }
  },
})
