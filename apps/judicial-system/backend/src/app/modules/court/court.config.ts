import { defineConfig } from '@island.is/nest/config'

export const courtModuleConfig = defineConfig({
  name: 'CourtModule',
  load: (env) => ({
    courtApiAvailable: !(env.optional('BLOCKED_API_INTEGRATION') ?? '')
      .split(',')
      .includes('COURT'),
  }),
})
