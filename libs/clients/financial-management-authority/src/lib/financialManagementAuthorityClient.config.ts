import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  authUrl: z.string(),
  basePath: z.string(),
  clientId: z.string(),
  clientSecret: z.string(),
  executeAsUsername: z.string()
})

export const FinancialManagementAuthorityClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: 'FinancialManagementAuthorityClient',
  schema,
  load: (env) => ({
    authUrl: env.required(
      'FINANCIAL_MANAGEMENT_AUTHORITY_IDS_URL',
      'https://identity-server.staging01.devland.is',
    ),
    basePath: env.required(
      'FINANCIAL_MANAGEMENT_AUTHORITY_BASE_PATH',
      'https://fjs-cdn-endpoint-elfur-dev-c6epg2fhcyc2a5bh.a03.azurefd.net',
    ),
    clientId: env.required(
      'FINANCIAL_MANAGEMENT_AUTHORITY_CLIENT_ID',
      '@fjs.is/stafraent-island-api-elfur',
    ),
    clientSecret: env.required(
      'FINANCIAL_MANAGEMENT_AUTHORITY_CLIENT_SECRET',
      '',
    ),
    executeAsUsername: env.required(
      'FINANCIAL_MANAGEMENT_AUTHORITY_EXECUTE_AS_USERNAME',
      '',
    ),
  }),
})
