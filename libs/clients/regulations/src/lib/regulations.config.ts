import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  url: z.string(),
  publishKey: z.string(),
  draftKey: z.string(),
  presignedKey: z.string(),
})

export const RegulationsClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'RegulationsClient',
  schema,
  load: (env) => ({
    url: env.required('REGULATIONS_API_URL', 'http://localhost:3000/api/v1'),
    publishKey: env.required('REGULATIONS_FILE_UPLOAD_KEY_PUBLISH', ''),
    draftKey: env.required('REGULATIONS_FILE_UPLOAD_KEY_DRAFT', ''),
    presignedKey: env.required('REGULATIONS_FILE_UPLOAD_KEY_PRESIGNED', ''),
  }),
})
