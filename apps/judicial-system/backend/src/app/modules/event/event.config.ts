import { defineConfig } from '@island.is/nest/config'

export const eventModuleConfig = defineConfig({
  name: 'EventModule',
  load: (env) => ({
    url: env.optional('EVENT_URL'),
    errorUrl: env.optional('ERROR_EVENT_URL'),
  }),
})
