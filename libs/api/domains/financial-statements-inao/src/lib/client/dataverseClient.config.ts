import { defineConfig } from '@island.is/nest/config'

export const dataverseClientConfig = defineConfig({
  name: 'DataverseClient',
  load: (env) => ({
    basePath: env.required('FINANCIAL_STATEMENTS_INAO_BASE_PATH'),
    issuer: env.required('FINANCIAL_STATEMENTS_INAO_ISSUER'),
    scope: env.required('FINANCIAL_STATEMENTS_INAO_SCOPE'),
    tokenEndpoint: env.required('FINANCIAL_STATEMENTS_INAO_TOKEN_ENDPOINT'),
    clientId: env.required('FINANCIAL_STATEMENTS_INAO_CLIENT_ID'),
    clientSecret: env.required('FINANCIAL_STATEMENTS_INAO_CLIENT_SECRET'),
  }),
})
