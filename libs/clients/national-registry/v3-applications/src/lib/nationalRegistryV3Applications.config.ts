import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  fetchTimeout: z.number().int(),
  clientId: z.string(),
  clientSecret: z.string(),
  scope: z.string(),
  endpoint: z.string(),
  xRoadServicePath: z.string(),
})

export const NationalRegistryV3ApplicationsClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: 'NationalRegistryV3ApplicationsClient',
  schema,
  load: (env) => ({
    fetchTimeout: env.optionalJSON('XROAD_NATIONAL_REGISTRY_TIMEOUT') ?? 10000,
    clientId: env.required(
      'NATIONAL_REGISTRY_B2C_CLIENT_ID',
      'b464afdd-056b-406d-b650-6d41733cfeb7',
    ),
    clientSecret: env.required('NATIONAL_REGISTRY_B2C_CLIENT_SECRET', ''),
    scope: env.required(
      'NATIONAL_REGISTRY_B2C_APPLICATION_SCOPE',
      'https://skraidentitydev.onmicrosoft.com/midlunumsoknir/.default',
    ),
    endpoint: env.required(
      'NATIONAL_REGISTRY_B2C_ENDPOINT',
      'https://skraidentitydev.b2clogin.com/skraidentitydev.onmicrosoft.com/b2c_1_midlun_flow/oauth2/v2.0/token',
    ),
    xRoadServicePath: env.required(
      'NATIONAL_REGISTRY_B2C_APPLICATION_PATH',
      'IS-DEV/GOV/10001/SKRA-Cloud-Protected/MidlunUmsoknir-v1',
    ),
  }),
})
