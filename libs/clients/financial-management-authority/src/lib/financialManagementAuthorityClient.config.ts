import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  basePath: z.string(),
  clientId: z.string(),
  clientSecret: z.string(),
})

export const FinancialManagementAuthorityClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: 'FinancialManagementAuthorityClient',
  schema,
  load: (env) => ({
    basePath: env.required(
      'FINANCIAL_MANAGEMENT_AUTHORITY_BASE_PATH',
      'https://fjs-cdn-endpoint-elfur-test-hhesbzhxabbwbqen.a03.azurefd.net',
    ),
    clientId: env.required(
      'FINANCIAL_MANAGEMENT_AUTHORITY_CLIENT_ID',
      '@fjs.is/stafraent-island-api-elfur',
    ),
    clientSecret: env.required(
      'FINANCIAL_MANAGEMENT_AUTHORITY_CLIENT_SECRET',
      '',
    ),
  }),
})
