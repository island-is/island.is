import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  basePath: z.string(),
  authUrl: z.string(),
  clientId: z.string(),
  clientSecret: z.string(),
  executeAsUsername: z.string(),
})

export const FinancialManagementAuthorityEmployeesClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: 'FinancialManagementAuthorityEmployeesClientConfig',
  schema,
  load: (env) => ({
    basePath: env.required(
      'ELFUR_BASE_PATH',
      'https://fjs-cdn-endpoint-elfur-test-hhesbzhxabbwbqen.a03.azurefd.net',
    ),
    authUrl: env.required(
      'ELFUR_BASE_IDS_URL',
      'https://identity-server.staging01.devland.is',
    ),
    clientId: env.required(
      'ELFUR_CLIENT_ID',
      '@fjs.is/stafraent-island-api-elfur',
    ),
    clientSecret: env.required('ELFUR_CLIENT_SECRET', ''),
    executeAsUsername: env.required('ELFUR_EXECUTE_AS_USERNAME', ''),
  }),
})
