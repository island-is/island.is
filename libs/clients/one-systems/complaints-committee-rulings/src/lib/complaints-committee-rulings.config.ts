import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  basePath: z.string(),
  apiKey: z.string(),
})

export const ComplaintsCommitteeRulingsClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: 'ComplaintsCommitteeRulingsClient',
  schema,
  load: (env) => ({
    basePath: env.required(
      'COMPLAINTS_COMMITTEE_RULINGS_API_BASE_PATH',
      'https://onedemo.onecrm.is',
    ),
    apiKey: env.required(
      'COMPLAINTS_COMMITTEE_RULINGS_API_KEY',
      'a-string-secret-at-least-256-bits-long',
    ),
  }),
})
