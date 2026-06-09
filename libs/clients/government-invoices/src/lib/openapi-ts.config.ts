import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  input: './libs/clients/government-invoices/src/clientConfig.json',
  output: {
    path: './libs/clients/government-invoices/gen/fetch',
    format: 'prettier',
    lint: 'eslint',
  },
  parser: {
    filters: {
      operations: {
        include: [
          'GET /v1/openinvoices/invoices',
          'GET /v1/openinvoices/invoices/{supplierId}/{customerId}',
          'GET /v1/openinvoices/suppliers',
          'GET /v1/openinvoices/customers',
          'GET /v1/openinvoices/paymenttypes',
          'GET /v1/openinvoices/types',
          'GET /v1/organization_employee/get_employees_for_organization',
        ],
      },
    },
  },
  plugins: [
    '@hey-api/client-fetch',
    {
      enums: true,
      name: '@hey-api/typescript',
    },
    {
      dates: true,
      name: '@hey-api/transformers',
    },
    {
      name: '@hey-api/sdk',
      transformer: true,
    },
  ],
})
