import * as z from 'zod'
import { defineConfig } from '@island.is/nest/config'
import { UniversityGatewayScope } from '@island.is/auth/scopes'

const schema = z.object({
  basePath: z.string(),
  scope: z.array(z.string()),
})

export const UniversityGatewayApiClientConfig = defineConfig({
  name: 'UniversityGatewayApiClient',
  schema,
  load(env) {
    return {
      basePath: env.required(
        'UNIVERSITY_GATEWAY_API_URL',
        'http://localhost:3380',
      ),
      scope: [UniversityGatewayScope.main],
    }
  },
})
