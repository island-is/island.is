import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

export const schema = z.object({
  xroad: z.object({
    baseUrl: z.string(),
    clientId: z.string(),
    path: z.string(),
    secret: z.string(),
  }),
  pkpass: z.object({
    apiKey: z.string(),
    apiUrl: z.string(),
    secretKey: z.string(),
    cacheKey: z.string(),
    cacheTokenExpiryDelta: z.string(),
    authRetries: z.string(),
  }),
})

export const GenericDrivingLicenseConfig = defineConfig<z.infer<typeof schema>>(
  {
    name: 'GenericDrivingLicenseConfig ',
    schema,
    load: (env) => ({
      xroad: {
        baseUrl: env.required('XROAD_BASE_PATH', 'http://localhost:8081'),
        clientId: env.required(
          'XROAD_CLIENT_ID',
          'IS-DEV/GOV/10000/island-is-client',
        ),
        secret: env.required('XROAD_DRIVING_LICENSE_SECRET', ''),
        path: env.required(
          'XROAD_DRIVING_LICENSE_PATH',
          'r1/IS-DEV/GOV/10005/Logreglan-Protected/RafraentOkuskirteini-v1',
        ),
      },
      pkpass: {
        apiKey: env.required('PKPASS_API_KEY', ''),
        apiUrl: env.required('PKPASS_API_URL', ''),
        secretKey: env.required('PKPASS_SECRET_KEY', ''),
        cacheKey: env.required('PKPASS_CACHE_KEY', 'smartsolution:apitoken'),
        cacheTokenExpiryDelta: env.required(
          'PKPASS_CACHE_TOKEN_EXPIRY_DELTA',
          '2000',
        ),
        authRetries: env.required('PKPASS_AUTH_RETRIES', '1'),
      },
    }),
  },
)
