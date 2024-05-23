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
      'RECYCLING_FUND_GQL_BASE_PATH',
      'http://localhost:3339/app/skilavottord/api/graphql',
    ),
  }),
})
