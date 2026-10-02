import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  input: './libs/clients/blikk/src/clientConfig.json',
  output: {
    path: './libs/clients/blikk/gen/fetch',
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
      // Blikk marks amounts and timestamps as int64, which would otherwise become BigInt — and the
      // body serializer sends a BigInt as a JSON string, which Blikk rejects for integer fields.
      bigInt: false,
      dates: true,
      name: '@hey-api/transformers',
    },
    {
      name: '@hey-api/sdk',
      transformer: true,
    },
  ],
})
