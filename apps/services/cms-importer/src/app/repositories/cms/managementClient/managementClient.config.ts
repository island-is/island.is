import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const ManagementClientConfigSchema = z.object({
  cmsAccessToken: z.string(),
})
export const ManagementClientConfig = defineConfig({
  name: 'ManagementClientConfig',
  schema: ManagementClientConfigSchema,
  load: (env) => ({
    cmsAccessToken: env.required('CONTENTFUL_MANAGEMENT_ACCESS_TOKEN', ''),
  }),
})
