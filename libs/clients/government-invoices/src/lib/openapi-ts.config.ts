import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  input: './libs/clients/government-invoices/src/clientConfig.json',
  output: {
    path: './libs/clients/government-invoices/gen/fetch',
    format: 'prettier',
    lint: 'eslint',
  },
  plugins: [
    '@hey-api/client-fetch',
    {
      enums: true,
      name: '@hey-api/typescript',
    },
    {
      dates: false,
      name: '@hey-api/transformers',
    },
    {
      name: '@hey-api/sdk',
      transformer: true,
    },
  ],
})
