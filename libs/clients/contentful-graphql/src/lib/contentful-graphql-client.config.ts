import { z } from 'zod'

import { defineConfig } from '@island.is/nest/config'

const schema = z.object({
  gqlBasePath: z.string(),
})

export const ContentfulClientConfig = defineConfig({
  name: 'ContentfulClientConfig',
  schema,
  load: (env) => ({
    gqlBasePath: env.required(
      'GRAPHQL_API_ENDPOINT',
      'https://graphql.contentful.com/content/v1/spaces/8k0h54kbe6bj/environments/master',
    ),
  }),
})
