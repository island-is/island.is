import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  basePath: z.string(),
  clientId: z.string(),
  clientSecret: z.string(),
  scope: z.string(),
  authenticationServer: z.string(),
})

export const FinancialManagementAuthorityClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: 'FinancialManagementAuthorityClient',
  schema,
  load: (env) => ({
    basePath: env.required(
      'FINANCIAL_MANAGEMENT_AUTHORITY_BASE_PATH',
      '',
    ),
    clientId: env.required(
      'FINANCIAL_MANAGEMENT_AUTHORITY_CLIENT_ID',
      ''
    ),
    clientSecret: env.required(
      'FINANCIAL_MANAGEMENT_AUTHORITY_CLIENT_SECRET',
      '',
    ),
    scope: env.required(
      'FINANCIAL_MANAGEMENT_AUTHORITY_SCOPE',
      ''
    ),
    authenticationServer: env.required(
      'FINANCIAL_MANAGEMENT_AUTHORITY_AUTHENTICATION_SERVER',
      '',
    ),
  }),
})
