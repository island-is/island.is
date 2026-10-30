import { defineConfig } from '@island.is/nest/config'

export const caseModuleConfig = defineConfig({
  name: 'CaseModule',
  load: (env) => ({
    robotMessageDelay: +(
      (env.optional('ROBOT_MESSAGE_DELAY') ?? '300') // 5 minutes, convert to number with +
    ),
    clientUrl: env.required('CLIENT_URL', 'http://localhost:4200'),
  }),
})
