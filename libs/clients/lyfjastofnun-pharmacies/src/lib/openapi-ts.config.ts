import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  input: './libs/clients/lyfjastofnun-pharmacies/src/clientConfig.json',
  output: {
    path: './libs/clients/lyfjastofnun-pharmacies/gen/fetch',
    format: 'prettier',
    lint: 'eslint',
  },
  parser: {
    filters: {
      operations: {
        include: [
        'GET /api/v1/Eftirlit/lyfjabudir',
        'GET /api/v1/Eftirlit/laeknastodvar',
        'GET /api/v1/Eftirlit/lyfjaheildsolur',
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
