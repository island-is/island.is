import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  input:
    './libs/clients/university-careers/src/lib/clients/university-of-iceland/clientConfig.yaml',
  output: {
    path: './libs/clients/university-careers/gen/fetch',
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
