import { defineConfig } from '@island.is/nest/config'

export const smsModuleConfig = defineConfig({
  name: 'SmsModule',
  load: (env) => ({
    url: env.required('NOVA_URL_V1', 'https://sms.nova.is/v1/'),
    username: env.required('NOVA_USERNAME_V1', 'S56572'),
    password: env.required('NOVA_PASSWORD_V1', ''),
  }),
})
