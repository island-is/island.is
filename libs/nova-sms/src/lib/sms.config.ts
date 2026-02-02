import { defineConfig } from '@island.is/nest/config'

export const smsModuleConfig = defineConfig({
  name: 'SmsModule',
  load: (env) => ({
    url: env.required('NOVA_URL', 'https://smsapi.devnova.is/v1/'),
    username: env.required('NOVA_USERNAME', 'IslandIs_User_Development'),
    password: env.required('NOVA_PASSWORD', ''),
  }),
})
