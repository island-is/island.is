import { defineConfig } from '@island.is/nest/config'

export const emailModuleConfig = defineConfig({
  name: 'EmailModule',
  load: (env) => ({
    region: env.optional('EMAIL_REGION') ?? 'eu-west-1',
    useNodemailerApp: env.optional('USE_NODEMAILER_APP', 'false') === 'true',
    useTestAccount: env.optional('EMAIL_USE_TEST_ACCOUNT', 'true') === 'true',
  }),
})
