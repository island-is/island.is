import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  input: './libs/clients/fjs/employment-certificate/src/clientConfig.json',
  output: {
    path: './libs/clients/fjs/employment-certificate/gen/fetch',
    format: 'prettier',
    lint: 'eslint',
  },
  // No date transformer: the API's timestamps stay strings.
  plugins: [
    '@hey-api/client-fetch',
    { enums: true, name: '@hey-api/typescript' },
    '@hey-api/sdk',
  ],
})
