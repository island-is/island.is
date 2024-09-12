import { defineConfig } from '@island.is/nest/config'

export const FinancialStatementsInaoClientConfig = defineConfig({
  name: 'DataverseClient',
  load: (env) => ({
    basePath: env.required(
      'FINANCIAL_STATEMENTS_INAO_BASE_PATH',
      'https://star-re.crm4.dynamics.com/api/data/v9.1',
    ),
    issuer: env.required(
      'FINANCIAL_STATEMENTS_INAO_ISSUER',
      'https://login.microsoftonline.com/05a20268-aaea-4bb5-bb78-960b0462185e/v2.0',
    ),
    scope: env.required(
      'FINANCIAL_STATEMENTS_INAO_SCOPE',
      'https://star-re.crm4.dynamics.com/.default',
    ),
    tokenEndpoint: env.required(
      'FINANCIAL_STATEMENTS_INAO_TOKEN_ENDPOINT',
      'https://login.microsoftonline.com/05a20268-aaea-4bb5-bb78-960b0462185e/oauth2/v2.0/token',
    ),
    clientId: env.required('FINANCIAL_STATEMENTS_INAO_CLIENT_ID', ''),
    clientSecret: env.required('FINANCIAL_STATEMENTS_INAO_CLIENT_SECRET', ''),
  }),
})
