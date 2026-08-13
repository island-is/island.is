import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  baseUrl: z.string(),
  clientId: z.string(),
  clientSecret: z.string(),
  scope: z.array(z.string()),
})

export const DataGatewayClientConfig = defineConfig({
  name: 'DataGatewayApi',
  schema,
  load(env) {
    return {
      baseUrl: env.required('MMS_DATA_GATEWAY_API_URL'),
      clientId: env.required('MMS_DATA_GATEWAY_API_CLIENT_ID'),
      clientSecret: env.required('MMS_DATA_GATEWAY_API_CLIENT_SECRET'),
      scope: env.optionalJSON('MMS_DATA_GATEWAY_API_SCOPE') ?? [],
    }
  },
})
