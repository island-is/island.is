import { z } from 'zod'
import { defineConfig } from '@island.is/nest/config'

const schema = z.object({
  managementAccessToken: z.string(),
  environmentId: z.string(),
})

export const ContentfulTranslationConfig = defineConfig({
  name: 'ContentfulTranslationConfig',
  schema,
  load: (env) => ({
    managementAccessToken: env.required('CONTENTFUL_MANAGEMENT_ACCESS_TOKEN'),
    environmentId: env.optional('CONTENTFUL_ENVIRONMENT') ?? 'master',
  }),
})
