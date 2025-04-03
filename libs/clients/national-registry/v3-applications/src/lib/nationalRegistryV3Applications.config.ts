import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  fetchTimeout: z.number().int(),
  xRoadServicePath: z.string(),
})

export const NationalRegistryV3ApplicationsClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: 'NationalRegistryV3ApplicationsClient',
  schema,
  load: (env) => ({
    fetchTimeout: 10000,
    xRoadServicePath: env.required(
      'NATIONAL_REGISTRY_B2C_PATH',
      'IS-DEV/GOV/10001/SKRA-Cloud-Protected/MidlunUmsoknir-v1',
    ),
  }),
})
