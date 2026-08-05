import { defineConfig } from '@island.is/nest/config'

export const appealCaseModuleConfig = defineConfig({
  name: 'AppealCaseModule',
  load: (env) => ({
    robotMessageDelay: +(
      (env.optional('ROBOT_MESSAGE_DELAY') ?? '300') // 5 minutes
    ),
  }),
})
