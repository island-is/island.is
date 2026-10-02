import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  input: './libs/clients/estates/src/clientConfig.json',
  parser: {
    filters: {
      tags: {
        include: ['IslandIsEstatePages'],
      },
    },
  },
  output: {
    path: './libs/clients/estates/gen/fetch',
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
