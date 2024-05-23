import { z } from 'zod'
import { defineConfig } from '@island.is/nest/config'

const schema = z.object({
  apiKey: z.string(),
  spaceId: z.string(),
  environment: z.string().default('master'),
})

export const ContentfulClientConfig = defineConfig({
  name: 'ContentfulClientConfig',
  schema,
  load: (env) => ({
    apiKey: env.required('CONTENTFUL_API_KEY', ''),
    spaceId: env.required('CONTENTFUL_SPACE_ID', ''),
    environment: env.optional('CONTENTFUL_ENVIRONMENT', 'master'),
  }),
})
