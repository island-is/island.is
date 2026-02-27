import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  input: './libs/clients/ship-registry-v2/src/clientConfig.json',
  output: {
    path: './libs/clients/ship-registry-v2/gen/fetch',
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
