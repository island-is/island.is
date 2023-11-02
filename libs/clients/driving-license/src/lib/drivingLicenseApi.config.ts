import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  xroadBaseUrl: z.string(),
  xroadClientId: z.string(),
  secret: z.string(),
  xroadPathV1: z.string(),
  xroadPathV2: z.string(),
  xroadPathV4: z.string(),
  xroadPathV5: z.string(),
})

export const DrivingLicenseApiConfig = defineConfig<z.infer<typeof schema>>({
  name: 'DrivingLicenseApi',
  schema,
  load(env) {
    return {
      xroadBaseUrl: env.required('XROAD_BASE_PATH', 'http://localhost:8081'),
      xroadClientId: env.required(
        'XROAD_CLIENT_ID',
        'IS-DEV/GOV/10000/island-is-client',
      ),
      secret: env.required('XROAD_DRIVING_LICENSE_SECRET', ''),
      xroadPathV1: env.required(
        'XROAD_DRIVING_LICENSE_PATH',
        'r1/IS-DEV/GOV/10005/Logreglan-Protected/RafraentOkuskirteini-v1',
      ),
      xroadPathV2: env.required(
        'XROAD_DRIVING_LICENSE_V2_PATH',
        'r1/IS-DEV/GOV/10005/Logreglan-Protected/RafraentOkuskirteini-v2',
      ),
      xroadPathV4: env.required(
        'XROAD_DRIVING_LICENSE_V4_PATH',
        'r1/IS-DEV/GOV/10005/Logreglan-Protected/Okuskirteini-v4',
      ),
      xroadPathV5: env.required(
        'XROAD_DRIVING_LICENSE_V5_PATH',
        'r1/IS-DEV/GOV/10005/Logreglan-Protected/Okuskirteini-v5',
      ),
    }
  },
})
