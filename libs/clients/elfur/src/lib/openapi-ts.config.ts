import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  input: './libs/clients/elfur/src/clientConfig.json',
  output: {
    path: './libs/clients/elfur/gen/fetch',
    format: 'prettier',
    lint: 'eslint',
  },
  plugins: [
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
