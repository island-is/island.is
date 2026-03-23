import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  input: './libs/clients/police-cases/src/clientConfig.yml',
  output: {
    path: './libs/clients/police-cases/gen/fetch',
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
