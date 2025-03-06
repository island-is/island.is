import { defineConfig } from '../defineConfig'

export const IdsClientConfig = defineConfig({
  name: 'IdsClientConfig',
  load: (env) => ({
    issuer: env.required(
      'IDENTITY_SERVER_ISSUER_URL',
      'https://innskra.dev01.devland.is',
    ),
    clientId: env.required(
      'IDENTITY_SERVER_CLIENT_ID',
      '@island.is/clients/dev',
    ),
    clientSecret: env.required('IDENTITY_SERVER_CLIENT_SECRET'),
  }),
})
