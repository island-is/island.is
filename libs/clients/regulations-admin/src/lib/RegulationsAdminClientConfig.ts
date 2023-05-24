import * as z from 'zod'
import { defineConfig } from '@island.is/nest/config'

const schema = z.object({
  baseApiUrl: z.string(),
  regulationsApiUrl: z.string(),
})

export const RegulationsAdminClientConfig = defineConfig({
  name: 'RegulationsAdminClientConfig',
  schema,
  load: (env) => ({
    baseApiUrl: env.required('REGULATIONS_ADMIN_URL', 'http://localhost:3333'),
    regulationsApiUrl: env.required(
      'REGULATIONS_API_URL',
      'http://localhost:3000/api/v1',
    ),
  }),
})
