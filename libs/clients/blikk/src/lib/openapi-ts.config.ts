import { defineConfig } from '@hey-api/openapi-ts'

// Imported by path: the openapi-ts CLI does not resolve workspace aliases.
// eslint-disable-next-line @nx/enforce-module-boundaries
import { defineResponseBodiesPlugin } from '../../../middlewares/src/lib/openapi-ts/responseBodiesPlugin'

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
      // The repo is on Zod 3; the plugin targets Zod 4 by default.
      compatibilityVersion: 3,
      name: 'zod',
    },
    {
      name: '@hey-api/sdk',
      transformer: true,
      // Responses are checked against Blikk's schemas before they are returned, so a malformed
      // 2xx body fails in the client instead of further down the payment flow.
      validator: { request: false, response: 'zod' },
    },
    // The generated client skips validation for an empty body, so `BlikkClientModule` checks empty
    // 2xx responses against the bodies the document declares.
    defineResponseBodiesPlugin(),
  ],
})
