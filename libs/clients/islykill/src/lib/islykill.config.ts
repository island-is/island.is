import { defineConfig } from '@island.is/nest/config'

export const IslykillClientConfig = defineConfig({
  name: 'IslykillClientModule',
  load: (env) => ({
    cert: env.required('ISLYKILL_CERT', ''),
    passphrase: env.required('ISLYKILL_SERVICE_PASSPHRASE', ''),
    basePath: env.required('ISLYKILL_SERVICE_BASEPATH', ''),
  }),
})
