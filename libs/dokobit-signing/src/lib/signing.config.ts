import { defineConfig } from '@island.is/nest/config'

export const signingModuleConfig = defineConfig({
  name: 'SigningModule',
  load: (env) => ({
    production: env.optional('NODE_ENV') === 'production',
    url: env.required('DOKOBIT_URL', 'https://developers.dokobit.com'),
    accessToken: env.required('DOKOBIT_ACCESS_TOKEN', ''),
    pollDurationSeconds: +(
      env.optional('DOKOBIT_POLL_DURATION_SECONDS') ?? '120'
    ),
    pollIntervalSeconds: +(
      env.optional('DOKOBIT_POLL_INTERVAL_SECONDS') ?? '5'
    ),
  }),
})
