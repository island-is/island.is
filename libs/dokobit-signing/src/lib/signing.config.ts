import { defineConfig } from '@island.is/nest/config'

export const signingModuleConfig = defineConfig({
  name: 'SigningModule',
  load: (env) => ({
    url: env.required('DOKOBIT_URL', 'https://developers.dokobit.com'),
    accessToken: env.required('DOKOBIT_ACCESS_TOKEN', ''),
  }),
})
