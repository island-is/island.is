import { defineConfig } from '@island.is/nest/config'

export const smsModuleConfig = defineConfig({
  name: 'SmsModule',
  load: (env) => ({
    url: env.required('NOVA_URL', 'https://sms.nova.is/v1/'),
    username: env.required('NOVA_USERNAME', 'S56572'),
    password: env.required('NOVA_PASSWORD', ''),
    senderName: env.optional('NOVA_SENDER_NAME', 'Island Dev'),
    payerCredentials: {
      // Add new payers here — one block per payer:
      Landlæknir: {
        username: env.optional('NOVA_LANDLAEKNIR_USERNAME', ''),
        password: env.optional('NOVA_LANDLAEKNIR_PASSWORD', ''),
      },
    } as Record<string, { username: string; password: string }>,
  }),
})
