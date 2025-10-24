import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  input:
    './libs/clients/health-directorate/src/lib/clients/health/clientConfig.json',
  output: {
    path: './libs/clients/health-directorate/src/lib/clients/health/gen/fetch',
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
      dates: true,
      name: '@hey-api/transformers',
    },
    {
      name: '@hey-api/sdk',
      transformer: true,
    },
  ],
})
